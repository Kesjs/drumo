import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const LOCAL_SESSION_COOKIE = "ep_session";

const PROTECTED_PREFIXES = [
  "/tablou-de-bord",
  "/verificare-identitate",
  "/plata",
  "/capitole",
  "/evaluare-adaptiva",
  "/evaluare-globala",
  "/examen/briefing",
  "/examen/sala",
  "/examen/rezultat",
  "/atestat",
  "/admin",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isProtectedPath(pathname) && !user) {
      const loginUrl = new URL("/conectare", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // Local fallback session cookie check
  if (isProtectedPath(pathname)) {
    const token = request.cookies.get(LOCAL_SESSION_COOKIE)?.value;
    if (!token || !token.includes(".")) {
      const loginUrl = new URL("/conectare", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|media/|icons/|sw.js).*)"],
};
