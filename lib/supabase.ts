/**
 * Cliente Supabase server-side
 * 
 * Este arquivo contém o cliente Supabase que deve ser usado APENAS em API routes.
 * O frontend NUNCA deve importar este arquivo diretamente.
 * 
 * Arquitetura: API-first design
 * - Frontend → API Routes → Supabase
 * - Isso permite adicionar lógica de negócio, validação e webhooks (N8N) nas rotas
 */
import { createClient } from '@supabase/supabase-js'

// Validação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Debug log para ajudar a identificar o problema
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase Config Error:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseServiceRoleKey,
    env: process.env.NODE_ENV
  })
  
  const missing = []
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')

  throw new Error(
    `Missing Supabase environment variables: ${missing.join(', ')}. Please check your .env.local file and restart the server.`
  )
}

/**
 * Cliente Supabase com Service Role Key
 * Usa a Service Role Key para bypassar RLS (Row Level Security)
 * Isso é seguro porque este cliente só é usado server-side
 */
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
