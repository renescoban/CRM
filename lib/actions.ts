"use server";

import { ActivityModel } from "@/models/ActivityModel";
import { ContactModel } from "@/models/ContactModel";
import { OrderModel } from "@/models/OrderModel";
import { Contact, Activity, CustomField, Order, Payment } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function getOrders(): Promise<Order[]> {
  const orders = await OrderModel.getAll()
  return orders
}

  export async function getContacts(): Promise<Contact[]>{
    const orders = await ContactModel.getAll()
    return orders
  }

export async function getActivities() {
  const orders = await ActivityModel.getAll()
    return orders
}
export async function getTags() {
  const res = await fetch(`${defaultUrl}/api/tags`);
  if (!res.ok) {
    throw new Error("Failed to fetch tags");
  }
  return res.json();
}

export async function updateUserRole(formData: FormData) {
  "use server";
  const supabase = await createClient();

  const rawFormData = {
    role: formData.get("role"),
    id: formData.get("id"),
  };

  const newRole = rawFormData.role === "user" ? "admin" : "user"; // Determine the new role

  try {
    // Update the profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", rawFormData.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      // Handle the error appropriately, e.g., throw an error or return an error message
    }
/*
    // Update Supabase Auth user metadata (if needed and configured)
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        user_metadata: {  // Important: Use user_metadata
          role: newRole,
        },
      },
    });

    if (authError) {
      console.error("Error updating auth user:", authError);
      // Handle the error appropriately
      return { error: "Error updating auth user" };  // Example
    }
*/
    console.log("User role updated:", rawFormData);
    redirect(`/admin`); // Redirect after successful updates

  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
