"use client";

interface InputTextProps {
  name: string;
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function InputText({name, label, value, defaultValue, placeholder, error, onChange}: InputTextProps)  {
  return(
    <div className='flex flex-col items-center w-full'>
      <label className='w-full text-start mb-2' htmlFor={name}>{label}</label>
      <input
        className='border rounded-md border-accent w-full h-10 mb-4 px-2 bg-secondary'
        id={name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        type="text"
        required
      />
      {error && (
        <p className="text-red-500 text-sm w-full text-start mb-3">{error}</p>
      )}
    </div>
  )
}