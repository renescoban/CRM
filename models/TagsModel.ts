import { Tag } from "@/types"
import { createClient } from "@/utils/supabase/server"

interface RawOrderTag {
  tag_id: string,
  tags: { name: string } | null,
}
interface ProcessedTag {
  name: string,
  count: number
}
function processTags(data: RawOrderTag[]): ProcessedTag[] {
  const tagMap = new Map<string, ProcessedTag>();

  for (const item of data) {
    const { tag_id, tags } = item;
    const tagName = tags?.name || "Unknown";

    if (tagMap.has(tag_id)) {
      // If the tag already exists in the map, increment its count
      const existingTag = tagMap.get(tag_id)!;
      existingTag.count += 1;
    } else {
      // If the tag doesn't exist in the map, add it with a count of 1
      tagMap.set(tag_id, {
        name: tagName,
        count: 1,
      });
    }
  }

  // Convert the map values to an array
  return Array.from(tagMap.values());
}

export class TagModel {
  static async getAll() {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tags')
      .select('*')
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async create(tag: Omit<Tag, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select()
      .single()
    if (error) throw error

    return data
  }

  static async update(id: string, tag: Partial<Tag>) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tags')
      .update(tag)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }

  static async delete(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  static async getByContactId(contactId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('contact_tags')
      .select('tags (*)')
      .eq('contact_id', contactId)
    if (error) throw error
    return data.map(item => item.tags) as unknown as Tag[]
  }

  static async getByName(name: string) {
    const supabase = await createClient()

    try {
      // Query the 'tags' table for a tag with the given name
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        console.error('Error fetching tag by name:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  }

  static async getTagCounts(table: "order" | "contact") {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from(`${table}_tags`)
      .select(`
        tag_id,
        tags (name)
      `)

    if (error) throw error

    const processedTags = processTags(data as unknown as RawOrderTag[])  ;
    return processedTags
  }
}

