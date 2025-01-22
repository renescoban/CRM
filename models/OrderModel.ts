
import { createClient } from "@/utils/supabase/server"
import { Order } from "@/types"
import { revalidatePath } from "next/cache"

export class OrderModel {
  static async getAll() {
    "use server"
    const supabase = await createClient()
    const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      contacts (name),
      payments (*)
      `)
      .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
    
    static async getById(id: string) {
      const supabase = await createClient()
      const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        contacts (name),
        payments (*),
        tags (*)
        `)
        .eq('id', id)
        .single()
        if (error) throw error
        return data
      }
      
      static async getByContactId(contactId: string) {
        const supabase = await createClient()
        const { data, error } = await supabase
        .from('orders')
        .select('*,payments (*)')
        .eq('contact_id', contactId)
        if (error) throw error
        return data
      }
      
      static async create(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
        "use server"
        const supabase = await createClient()
        const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        if (error) throw error
        
        revalidatePath('/orders')
        return data[0]
      }
      
      static async update(id: string, order: Partial<Order>) {
        const supabase = await createClient()
        const { data, error } = await supabase
        .from('orders')
        .update(order)
        .eq('id', id)
        .select()
        if (error) throw error
    return data[0]
  }

  static async delete(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  static async addTag(orderId: string, tagId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
    .from("order_tags")
    .insert({ order_id: orderId, tag_id: tagId })
    if (error) throw error
}
static async removeTag(orderId: string, tagId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
  .from("order_tags")
  .delete()
  .match({ order_id: orderId, tag_id: tagId })
  if (error) throw error
}

}

