import { login } from './actions'
import InputEmail from '@/components/inputEmail'
import InputPassword from '@/components/inputPassword'
import Button from '@/components/button'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <div>
        <h1 className="text-center mb-12 text-4xl">Connexion</h1>
        <form className="flex flex-col justify-center items-center min-w-96 p-8 border rounded-md bg-stone-950 border-teal-500">
          <InputEmail name="email" label="Email" />
          <InputPassword name="password" label="Mot de passe" />
          <Button formAction={login} text="Connexion" />
        </form>
        <div className="flex flex-col justify-center items-center mt-8">
          <p>
            Vous n'avez pas encore de compte ?
            <Link className="text-teal-500" href="/signup"> Créer en un !</Link>
          </p>
        </div>
      </div>
    </div>
  )
}