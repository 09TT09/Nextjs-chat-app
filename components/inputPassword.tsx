"use client";

interface InputPasswordProps {
  name: string;
  label: string;
  error?: string;
}

export default function InputPassword({name, label, error}: InputPasswordProps)  {
  return(
    <div className='flex flex-col items-center w-full'>
      <label className='w-full text-start mb-2' htmlFor={name}>{label}</label>
      <input 
        className={`border rounded-md w-full h-10 px-2 bg-secondary ${error ? "mb-1 border-red-700" : "mb-4 border-accent"}`}
        id={name}
        name={name}
        type="password"
        required
      />
      {error && (
        <p className="text-red-500 text-sm w-full text-start mb-3">{error}</p>
      )}
    </div>
  )
}