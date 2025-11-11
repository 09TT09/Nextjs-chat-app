'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signupSchema } from '@/schemas/signupSchema'
import { createClient } from '@/utils/supabase/server'
import { treeifyError } from 'zod'

type SignupState = {
  success?: boolean
  error?: Record<string, string[]>
  values?: Record<string, string>
}

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const supabase = await createClient()

  // Data from the form
  const rawData = {
    firstname: formData.get('firstname') as string,
    lastname: formData.get('lastname') as string,
    pseudo: formData.get('pseudo') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    passwordConfirmation: formData.get('password-confirmation') as string,
  }

  // Validate fields
  const parsed = signupSchema.safeParse(rawData)
  if (!parsed.success) {
    const tree = treeifyError(parsed.error)
    return {
      error: {
        firstname: tree.properties?.firstname?.errors || [],
        lastname: tree.properties?.lastname?.errors || [],
        pseudo: tree.properties?.pseudo?.errors || [],
        email: tree.properties?.email?.errors || [],
        password: tree.properties?.password?.errors || [],
        passwordConfirmation: tree.properties?.passwordConfirmation?.errors || [],
      },
      values: {
        firstname: rawData.firstname,
        lastname: rawData.lastname,
        pseudo: rawData.pseudo,
        email: rawData.email,
      },
    }
  }
  const data = parsed.data

  // Check if the pseudo already exists in profiles
  const { data: existingPseudo } = await supabase.from('profiles').select('id').ilike('pseudo', data.pseudo).maybeSingle()
  if (existingPseudo) {
    return {
      error: { pseudo: ["Ce pseudo est déjà utilisé."] },
      values: rawData
    }
  }

  // Signup only if there is no error
  const { data: signupResponse, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        pseudo: data.pseudo,
      },
    },
  })

  // Return generals errors
  if (error) {
    if (error.message.includes("already registered")) {
      return {
        error: { email: ["Cet email est déjà utilisé."] },
        values: rawData
      }
    }
    if (error?.message?.includes('duplicate key')) {
      return {
        error: { general: ["Ce pseudo ou cet email est déjà utilisé."] },
        values: rawData
      }
    }
    return {
      error: { general: [error.message] },
      values: rawData
    }
  }

  await supabase.from('profiles').upsert({
    id: signupResponse.user?.id,
    firstname: data.firstname,
    lastname: data.lastname,
    pseudo: data.pseudo,
    email: data.email,
  })

  revalidatePath('/', 'layout')
  redirect('/')
}