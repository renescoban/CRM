import { createClient } from "@/utils/supabase/server"
import { Contact } from "@/types"

export interface Contact22 {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
  updated_at: string
}

export class ContactModel {
  
  static async getAll() {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('contacts')
      .select('        *')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async create(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
    if (error) throw error
    return data[0]
  }

  static async update(id: string, contact: Partial<Contact>) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('contacts')
      .update(contact)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }

  static async delete(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

