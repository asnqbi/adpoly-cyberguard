import { HttpError, isSameOrigin, json, readJson } from "@/lib/http";
import { sessionClient } from "@/lib/supabase/server";
const failure = "Unable to sign in. Check your credentials and admin access.";
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: failure }, 403);
  try {
    const body = (await readJson(request, 4096)) as Record<
      string,
      unknown
    > | null;
    if (
      !body ||
      typeof body.email !== "string" ||
      typeof body.password !== "string" ||
      !body.password ||
      body.password.length > 1024 ||
      body.email.length > 254
    )
      return json({ error: failure }, 400);
    const supabase = await sessionClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email.trim(),
      password: body.password,
    });
    if (error || !data.user) return json({ error: failure }, 401);
    const { data: admin, error: lookupError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();
    if (lookupError || !admin) {
      await supabase.auth.signOut({ scope: "local" });
      return json({ error: failure }, lookupError ? 503 : 403);
    }
    return json({ success: true });
  } catch (error) {
    return json(
      { error: failure },
      error instanceof HttpError ? error.status : 503,
    );
  }
}
