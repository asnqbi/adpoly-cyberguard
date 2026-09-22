import { HttpError, isSameOrigin, json, readJson } from "@/lib/http";
import { requireAdmin } from "@/lib/supabase/admin";
type Context = { params: Promise<{ id: string }> };
const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const failure = "Unable to update messages. Please try again.";

async function mutate(
  request: Request,
  context: Context,
  action: "update" | "delete",
) {
  if (!isSameOrigin(request)) return json({ error: "Request rejected." }, 403);
  try {
    const { supabase } = await requireAdmin();
    const { id } = await context.params;
    if (!isUuid(id)) return json({ error: "Invalid message." }, 400);
    if (action === "update") {
      const body = (await readJson(request, 1024)) as Record<
        string,
        unknown
      > | null;
      if (
        !body ||
        !["read", "contacted"].includes(String(body.status)) ||
        Object.keys(body).some((key) => key !== "status")
      )
        return json({ error: "Invalid status." }, 400);
      const { data, error } = await supabase
        .from("contact_submissions")
        .update({ status: body.status })
        .eq("id", id)
        .select("id,status")
        .maybeSingle();
      if (error) return json({ error: failure }, 503);
      return data
        ? json({ success: true, message: data })
        : json({ error: "Message not found." }, 404);
    }
    const { data, error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) return json({ error: failure }, 503);
    return data
      ? json({ success: true })
      : json({ error: "Message not found." }, 404);
  } catch (error) {
    return json(
      {
        error:
          error instanceof HttpError && error.status < 500
            ? error.message
            : failure,
      },
      error instanceof HttpError ? error.status : 503,
    );
  }
}
export const PATCH = (request: Request, context: Context) =>
  mutate(request, context, "update");
export const DELETE = (request: Request, context: Context) =>
  mutate(request, context, "delete");
