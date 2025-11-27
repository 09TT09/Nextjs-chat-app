"use client"

import { login } from "./actions"
import InputEmail from "@/components/inputEmail"
import InputPassword from "@/components/inputPassword"
import Button from "@/components/button"
import Link from "next/link"
import { useActionState } from "react"

const initialState = {
  error: {},
  values: {}
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState)

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <div className="flex flex-col justify-center items-center flex-1">
        <h1 className="text-center mb-12 text-4xl">Connexion</h1>
        <form className="flex flex-col justify-center items-center min-w-18/20 py-4 px-2 mx-3 border rounded-md bg-primary border-accent shadow-lg xs:min-w-96 xs:p-8">
          <InputEmail name="email" label="Email" defaultValue={state.values?.email} error={state.error?.email?.[0]} />
          <InputPassword name="password" label="Mot de passe" error={state.error?.password?.[0]} />

          {state.error?.general && (
            <p className="text-red-500 text-sm mt-1">{state.error.general[0]}</p>
          )}

          <div className="mt-6"></div>
          <Button formAction={formAction} text="Connexion" />
        </form>
        <div className="flex flex-col justify-center items-center mt-8">
          <p className="text-center w-68 xs:w-auto">
            Vous n&apos;avez pas encore de compte ?
            <Link className="text-orange-400 transition duration-250 hover:text-orange-500" href="/signup"> Créer en un !</Link>
          </p>
        </div>
      </div>
    </div>
  )
}