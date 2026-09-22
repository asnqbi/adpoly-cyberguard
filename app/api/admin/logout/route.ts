import { isSameOrigin, json } from "@/lib/http";
import { sessionClient } from "@/lib/supabase/server";
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Request rejected." }, 403);
  try {
    const { error } = await (
      await sessionClient()
    ).auth.signOut({ scope: "local" });
    if (error)
      return json({ error: "Unable to sign out. Please try again." }, 503);
    return json({ success: true });
  } catch {
    return json({ error: "Unable to sign out. Please try again." }, 503);
  }
}
