'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

type CreateConversationState = {
  success?: boolean
  error?: Record<string, string[]>
  values?: Record<string, string>
}

export async function createConversation(
  prevState: CreateConversationState,
  formData: FormData
): Promise<CreateConversationState> {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const friendsAdded = formData.getAll('added-friends') as string[]

  const errors: Record<string, string[]> = {}

  if (!name || name.trim().length < 3) {
    errors.name = ['Le nom de la conversation est requis (min. 3 caractères)']
  }

  if (friendsAdded.length === 0) {
    errors.friends = ['Ajoutez au moins un ami']
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: errors,
      values: { name }
    }
  }

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      error: { general: ['Utilisateur non authentifié'] }
    }
  }

  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .insert({
      name,
      user_to_user: false,
      user1_id: null,
      user2_id: null,
      created_by: user.id
    })
    .select()
    .single()

  if (conversationError || !conversation) {
    return {
      error: { general: ['Erreur lors de la création de la conversation'] }
    }
  }

  const participants = [
    { user_id: user.id, conversation_id: conversation.id },
    ...friendsAdded.map(friendId => ({
      user_id: friendId,
      conversation_id: conversation.id
    }))
  ]

  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert(participants)

  if (participantsError) {
    return {
      error: { general: ['Erreur lors de l’ajout des participants'] }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
