interface InputTextProps {
  name: string,
  label: string,
  defaultValue?: string
  error?: string
}

export default function InputText({name, label, defaultValue, error}: InputTextProps)  {
  return(
    <div className='flex flex-col items-center w-full'>
      <label className='w-full text-start mb-2' htmlFor={name}>{label}</label>
      <input
        className='border rounded-md border-gray-800 w-full h-10 mb-4 px-2 bg-[#0a0a0a]'
        id={name}
        name={name}
        defaultValue={defaultValue}
        type="text"
        required
      />
      {error && (
        <p className="text-red-500 text-sm w-full text-start mb-3">{error}</p>
      )}
    </div>
  )
}