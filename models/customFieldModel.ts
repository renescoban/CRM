import { createClient } from "@/utils/supabase/server"


export interface CustomField {
  id: string
  contact_id: string
  name: string
  value: string
  created_at: string
  updated_at: string
}

export class CustomFieldModel {
  static async getAll() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async create(customField: Omit<CustomField, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('custom_fields')
      .insert(customField)
      .select()
    if (error) throw error
    return data[0]
  }

  static async update(id: string, customField: Partial<CustomField>) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('custom_fields')
      .update(customField)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }

  static async delete(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('custom_fields')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  static async getByContactId(contactId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('contact_id', contactId)
    if (error) throw error
    return data
  }
}

