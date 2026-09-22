import { CONTACT_ERROR, validateContact } from "@/lib/contact";
import { HttpError, json, readJson } from "@/lib/http";
import { publicInsertClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const input = validateContact(await readJson(request));
    if (!input) return json({ error: CONTACT_ERROR }, 400);
    // Do not append .select(): anonymous visitors have insert-only access.
    const { error } = await publicInsertClient()
      .from("contact_submissions")
      .insert(input);
    if (error) return json({ error: CONTACT_ERROR }, 503);
    return json({ success: true }, 201);
  } catch (error) {
    return json(
      { error: CONTACT_ERROR },
      error instanceof HttpError ? error.status : 503,
    );
  }
}
