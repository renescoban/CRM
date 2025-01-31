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

  export async function getContacts(){
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

  if (rawFormData.role === "user") {
    await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", rawFormData.id);
    const { error } = await supabase.auth.updateUser({
      // The user ID you want to update
      data: {
        role: "admin", // The new role you want to set
      },
    });
  } else {
    await supabase
      .from("profiles")
      .update({ role: "user" })
      .eq("id", rawFormData.id);
    const { error } = await supabase.auth.updateUser({
      // The user ID you want to update
      data: {
        role: "user", // The new role you want to set
      },
    });
  }

  console.log("User role updated: ", rawFormData);
  redirect(`/admin`);
}
