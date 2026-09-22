import { CONTACT_SUBJECTS, dubaiDayBounds } from "@/lib/contact";
import { HttpError, json } from "@/lib/http";
import { requireAdmin } from "@/lib/supabase/admin";
export async function GET(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const params = new URL(request.url).searchParams;
    const search = (params.get("search") || "").trim();
    const subject = params.get("subject") || "";
    const order = params.get("order") || "newest";
    const rawPage = params.get("page") || "1";
    if (
      search.length > 120 ||
      (subject &&
        !CONTACT_SUBJECTS.includes(
          subject as (typeof CONTACT_SUBJECTS)[number],
        )) ||
      !["newest", "oldest"].includes(order) ||
      !/^\d{1,6}$/.test(rawPage) ||
      Number(rawPage) < 1
    )
      return json({ error: "Invalid filters." }, 400);
    const page = Number(rawPage),
      pageSize = 20;
    let query = supabase
      .from("contact_submissions")
      .select("id,name,organization,email,subject,message,created_at,status", {
        count: "exact",
      });
    if (subject) query = query.eq("subject", subject);
    if (search) {
      // Quote PostgREST values and escape LIKE metacharacters; search text cannot become filter syntax.
      const escaped = search.replace(/[\\%_]/g, "\\$&").replace(/"/g, '\\"');
      query = query.or(
        ["name", "organization", "email", "subject", "message"]
          .map((column) => `${column}.ilike."%${escaped}%"`)
          .join(","),
      );
    }
    const bounds = dubaiDayBounds();
    const results = await Promise.all([
      query
        .order("created_at", { ascending: order === "oldest" })
        .order("id", { ascending: order === "oldest" })
        .range((page - 1) * pageSize, page * pageSize - 1),
      supabase
        .from("contact_submissions")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .gte("created_at", bounds.start)
        .lt("created_at", bounds.end),
    ]);
    if (results.some((result) => result.error))
      return json({ error: "Unable to load messages. Please try again." }, 503);
    return json({
      messages: results[0].data,
      count: results[0].count ?? 0,
      page,
      pageSize,
      stats: {
        total: results[1].count ?? 0,
        new: results[2].count ?? 0,
        today: results[3].count ?? 0,
      },
    });
  } catch (error) {
    return json(
      {
        error:
          error instanceof HttpError && error.status < 500
            ? error.message
            : "Unable to load messages. Please try again.",
      },
      error instanceof HttpError ? error.status : 503,
    );
  }
}
