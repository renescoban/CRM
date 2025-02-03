import AdminUserList from "@/components/Admin-User-List";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function getUsers() {
  "use server";
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*");
  return data;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data,  } = await supabase.auth.getUser()
  if ( !data?.user) {
    redirect('/login')
  }

  if ( data.user.user_metadata.role !== "admin") {
    // console.error("No admin role")
  }

  const users = ( await getUsers() ) as {
    id: string;
    name: string;
    role: string;
    email: string;
  }[];

  const filteredUsers = users.filter(user => user.id !== data?.user.id);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminUserList users={filteredUsers}  />
    </div>
  );
}
