import { createClient } from "@/utils/supabase/server"

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  created_at: string
  updated_at: string
}

export class ProductModel {
  static async getAll() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
    if (error) throw error
    return data[0]
  }

  static async update(id: string, product: Partial<Product>) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }

  static async delete(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

