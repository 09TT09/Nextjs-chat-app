"use client"

import { signup } from './actions'
import InputText from '@/components/inputText'
import InputEmail from '@/components/inputEmail'
import InputPassword from '@/components/inputPassword'
import Button from '@/components/button'
import Link from 'next/link'
import { useActionState } from 'react'

const initialState = { error: {} }

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, {
    error: {},
    values: {},
  })

  return (
    <div className='flex justify-center items-center w-full min-h-screen'>
      <div>
        <h1 className='text-center mb-12 text-4xl'>Inscription</h1>
        <form action={formAction} className='flex flex-col justify-center items-center w-2xl p-8 border rounded-md bg-stone-950 border-teal-500'>
          <div className="grid grid-cols-2 gap-x-8 w-full">
            <InputText name="firstname" label="Prénom" defaultValue={state.values?.firstname} error={state.error?.firstname?.[0]} />
            <InputText name="lastname" label="Nom" defaultValue={state.values?.lastname} error={state.error?.lastname?.[0]} />
            <InputText name="pseudo" label="Pseudo" defaultValue={state.values?.pseudo} error={state.error?.pseudo?.[0]} />
            <InputEmail name="email" label="Email" defaultValue={state.values?.email} error={state.error?.email?.[0]} />
            <InputPassword name="password" label="Mot de passe" error={state.error?.password?.[0]} />
            <InputPassword name="password-confirmation" label="Confirmation du mot de passe" error={state.error?.passwordConfirmation?.[0]} />
          </div>

          {state.error?.general && (
            <p className="text-red-500 text-sm mt-4">{state.error.general[0]}</p>
          )}

          <Button text="Inscription" />
        </form>
        <div className='flex flex-col justify-center items-center mt-8'>
          <p>
            Vous avez déjà un compte ?
            <Link className='text-teal-500' href="/login"> Connectez vous !</Link>
          </p>
        </div>
      </div>
    </div>
  )
}