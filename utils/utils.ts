import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}


export async function checkAuth(isAdminOnly = false) {
  const supabase = createClient()

  const { data: { user } } = await (await supabase).auth.getUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (isAdminOnly) {

    if ( user.user_metadata.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  return null // Auth check passed
}

