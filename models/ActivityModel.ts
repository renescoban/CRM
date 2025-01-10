import { createClient } from "@/utils/supabase/server"
import { Activity } from "@/types"
export interface Activity222 {
  id: string
  contact_id: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'task'
  description: string
  date: string
  due_date?: string
  created_at: string
  updated_at: string
}

export class ActivityModel {
  static async getAll() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('activities')
      .select('*')
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const supabase =await createClient()
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async getByContactId(contactId: string) {
    const supabase =await createClient()
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('contact_id', contactId)
    if (error) throw error
    return data
  }

  static async create(activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) {
    const supabase =await createClient()
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
    if (error) throw error
    return data[0]
  }

  static async update(id: string, activity: Partial<Activity>) {
    const supabase =await createClient()
    const { data, error } = await supabase
      .from('activities')
      .update(activity)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }

  static async delete(id: string) {
    const supabase =await createClient()
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

