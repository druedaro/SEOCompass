import { supabase } from '@/config/supabase';

export class BaseCrudService<T, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
  constructor(protected tableName: string) {}

  async getAll(filters?: Record<string, unknown>, orderBy: { column: string; ascending?: boolean } = { column: 'created_at', ascending: false }): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(input: CreateInput): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: UpdateInput): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq('id', id);
    if (error) throw error;
  }
}
