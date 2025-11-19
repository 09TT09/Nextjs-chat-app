"use client";

interface InputEmailProps {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
}

export default function InputEmail({name, label, defaultValue, error}: InputEmailProps)  {
  return(
    <div className="flex flex-col items-center w-full">
      <label className="w-full text-start mb-2" htmlFor={name}>{label}</label>
      <input
        className={`border rounded-md w-full h-10 px-2 bg-secondary ${error ? "mb-1 border-red-700" : "mb-4 border-accent"}`}
        id={name}
        name={name}
        defaultValue={defaultValue}
        type="email"
        required
      />
      {error && (
        <p className="text-red-500 text-sm w-full text-start mb-4">{error}</p>
      )}
    </div>
  )
}