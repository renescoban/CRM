import { createClient } from "@/utils/supabase/server"
import { Payment } from "@/types"

export interface Payment2 {
  id: string
  order_id: string
  amount: number
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'other'
  notes?: string
  created_at: string
}

export class PaymentModel {
  static async getAll() {
    const supabase= await createClient() 
    const { data, error } = await supabase
      .from('payments')
      .select('*')
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const supabase= await createClient() 
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async getByOrderId(orderId: string) {
    const supabase= await createClient() 
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
    if (error) throw error
    return data
  }

  static async create(payment: Omit<Payment, 'id' | 'created_at'>) {
    const supabase= await createClient() 
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
    if (error) throw error
    return data[0]
  }

  static async update(id: string, payment: Partial<Payment>) {
    const supabase= await createClient() 
    const { data, error } = await supabase
      .from('payments')
      .update(payment)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }

  static async delete(id: string) {
    const supabase= await createClient() 
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

