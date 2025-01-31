import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();

  // protected routes
  if ( user.error && !request.nextUrl.pathname.startsWith("/sign") ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
   user.data.user?.user_metadata.role !== "admin" &&
    request.nextUrl.pathname.startsWith("/orders") ||
    request.nextUrl.pathname.startsWith("/contacts") ||
    request.nextUrl.pathname === "/reports" ||
    request.nextUrl.pathname === "/protected" ||
    request.nextUrl.pathname === "/activities" ||
    request.nextUrl.pathname === "/admin"
  ) {
    return NextResponse.redirect(new URL("/no-admin", request.url));
  }

  return response;
};
