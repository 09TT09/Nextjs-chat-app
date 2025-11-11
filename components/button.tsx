interface ButtonProps {
  formAction?: (formData: FormData) => void | Promise<void>;
  text: string
}

export default function Button({formAction, text}: ButtonProps)  {
  return(
    <button
      className='h-12 min-w-36 rounded-md bg-teal-500 text-black mt-6 p-2 cursor-pointer transition duration-250 hover:bg-teal-300'
      formAction={formAction}
    >
      {text}
    </button>
  )
}