import { createClient } from '@/lib/supabase/server'

export interface ArenaItem {
  id: string
  name: string
  franchise_id?: string
  city: string
  address: string
  lat: number
  lng: number
  hourly_rate: number
  timings_open?: string
  timings_close?: string
  image_url?: string
  description?: string
  facilities?: string[]
  is_active: boolean
}

export async function getArenas(city?: string): Promise<ArenaItem[]> {
  const supabase = await createClient()
  let query = supabase
    .from('arenas')
    .select('id, name, franchise_id, city, address, lat, lng, hourly_rate, timings_open, timings_close, image_url, description, facilities, is_active')
    .eq('is_active', true)

  if (city) {
    query = query.ilike('city', `%${city}%`)
  }

  const { data, error } = await query.order('name')
  if (error) {
    console.error('getArenas error:', error)
    return []
  }
  return (data ?? []) as ArenaItem[]
}

export async function getArenaById(id: string): Promise<ArenaItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('arenas')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('getArenaById error:', error)
    return null
  }
  return data as ArenaItem
}
