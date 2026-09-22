import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { cookieOptions, supabaseConfig, uncachedFetch } from "./config";
import { HttpError } from "@/lib/http";

export async function sessionClient() {
  const config = supabaseConfig();
  if (!config) throw new HttpError(503, "Supabase is not configured");
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions,
    global: { fetch: uncachedFetch },
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) =>
            jar.set(name, value, options),
          );
        } catch {
          /* Server Components cannot write cookies. proxy.ts refreshes the session before rendering. */
        }
      },
    },
  });
}

// Isolated anonymous client: contact submissions never inherit an admin session.
export function publicInsertClient() {
  const config = supabaseConfig();
  if (!config) throw new HttpError(503, "Supabase is not configured");
  return createClient(config.url, config.key, {
    global: { fetch: uncachedFetch },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
