import { Suspense } from 'react'
import DashboardClient from '@/components/Dashboard-Client';
import { createClient } from '@/utils/supabase/server';
import LandingPage from '@/components/Landing-Page';
import { getActivities, getContacts, getOrders } from '@/lib/actions';

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user?.id).single()

  if (!user || profile?.role !== "admin") {
    return <LandingPage />
  }

  const [contacts, orders, activities] = await Promise.all([
    getContacts(),
    getOrders(),
    getActivities()
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClient 
        initialContacts={contacts}
        initialOrders={orders}
        initialActivities={activities}
      />
    </Suspense>
  );
}