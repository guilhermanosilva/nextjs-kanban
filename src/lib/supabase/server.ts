import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { ActionResponse } from '@/lib/types/action-response'
import { User } from '@/lib/types/user'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {}
      },
    },
  })
}

export async function getUser(): Promise<ActionResponse<User>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    return { success: true, data: user }
  } catch {
    return { success: false, error: 'Erro ao buscar usuário' }
  }
}
