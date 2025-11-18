"use client";

interface InputEmailProps {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
}

export default function InputEmail({name, label, defaultValue, error}: InputEmailProps)  {
  return(
    <div className='flex flex-col items-center w-full'>
      <label className='w-full text-start mb-2' htmlFor={name}>{label}</label>
      <input
        className='border rounded-md border-accent w-full h-10 mb-4 px-2 bg-secondary'
        id={name}
        name={name}
        defaultValue={defaultValue}
        type="email"
        required
      />
      {error && (
        <p className="text-red-500 text-sm w-full text-start mb-3">{error}</p>
      )}
    </div>
  )
}