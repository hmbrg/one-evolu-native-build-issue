import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { setCurrentRequestHeaders } from "one/headers";

export function getSupabaseServerClient(request: Request) {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    throw new Error(`Missing VITE_SUPABASE_URL`);
  }
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error(`Missing VITE_SUPABASE_ANON_KEY`);
  }

  const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "");

  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      auth: {
        debug(message, ...args) {
          if (process.env.DEBUG) {
            console.info(` [supabase-auth] ${message}`, ...args);
          }
        },
      },
      cookies: {
        getAll() {
          return cookies;
        },

        setAll(cookiesToSet) {
          setCurrentRequestHeaders((headers) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              headers.append(
                "Set-Cookie",
                serializeCookieHeader(name, value, options)
              )
            );
          });
        },
      },
    }
  );
}
