import "server-only";
import { sessionClient } from "./server";
import { HttpError } from "@/lib/http";

export async function requireAdmin() {
  const supabase = await sessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new HttpError(401, "Sign in required");
  const { data: admin, error: lookupError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (lookupError) throw new HttpError(503, "Unable to verify access");
  if (!admin) throw new HttpError(403, "Admin access required");
  return { supabase, user };
}
