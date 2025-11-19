'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { loginSchema } from '@/schemas/loginSchema'
import { treeifyError } from 'zod'
import { createClient } from '@/utils/supabase/server'

type LoginState = {
  error?: Record<string, string[]>
  values?: Record<string, string>
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createClient()

  // Data from the form
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate fields
  const parsed = loginSchema.safeParse(rawData)
  if (!parsed.success) {
    const tree = treeifyError(parsed.error)
    return {
      error: {
        email: tree.properties?.email?.errors || [],
        password: tree.properties?.password?.errors || [],
      },
      values: {
        email: rawData.email,
      },
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: rawData.email,
    password: rawData.password,
  })

  if (error) {
    return {
      error: { general: ["Email ou mot de passe incorrect"] },
      values: rawData
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}