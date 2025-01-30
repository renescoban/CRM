import AdminUserList from "@/components/Admin-User-List";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

async function getUsers() {
  "use server";
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*");
  return data;
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // console.error("No active session")
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session?.user.id)
    .single();

  if (error || profile?.role !== "admin") {
    // console.error("No admin role")
  }

  const users = ( await getUsers() ) as {
    id: string;
    name: string;
    role: string;
    email: string;
  }[];

  const filteredUsers = users.filter(user => user.id !== session?.user.id);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminUserList users={filteredUsers}  />
    </div>
  );
}
