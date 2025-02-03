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
  
  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.data.user?.id).single()
  if ( profile?.role !== "admin" && isProtectedRoute(request.nextUrl.pathname) )
   {
    return NextResponse.redirect(new URL("/no-admin", request.url));
  }
  function isProtectedRoute(pathname:string) {
    const protectedPaths = [
      "/orders",
      "/contacts",
      "/reports",
      "/protected",
      "/activities",
      "/admin",
     // "/",
      // Add any other admin-only paths here
    ];
  
    // Check if the pathname starts with any of the protected paths.  This handles sub-paths as well (e.g. /orders/details)
    return protectedPaths.some(path => pathname === path || pathname.startsWith(path + "/"));//protectedPaths.some(path => pathname === path || pathname.startsWith(path + "/"));
  }
  return response;
};
