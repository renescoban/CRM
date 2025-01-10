import { createClient } from "@/utils/supabase/server"
import { Order } from "@/types"

export interface Order22 {
  id: string
  contact_id: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  estimated_delivery: string
  order_note?: string
  created_at: string
  updated_at: string
}

export class OrderModel {
  static async getAll() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async getByContactId(contactId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('contact_id', contactId)
    if (error) throw error
    return data
  }

  static async create(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
    if (error) throw error
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
}

