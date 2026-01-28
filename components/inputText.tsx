"use client";

interface InputTextProps {
  name: string;
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  variant?: "default" | "variant-1";
}

export default function InputText({ name, label, value, defaultValue, placeholder, error, required, onChange, variant = "default", }: InputTextProps) {
  const isInline = variant === "variant-1";

  return (
    <div
      className={
        isInline
          ? "flex flex-col gap-1 p-3 bg-secondary rounded-md border border-accent shadow-sm w-full"
          : "flex flex-col items-center w-full px-6 xs:p-0"
      }
    >
      <label
        htmlFor={name}
        className={
          isInline
            ? "text-sm text-gray-400"
            : "w-full text-start mb-2"
        }
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        type="text"
        required={required}
        className={
          isInline
            ? `text-white border rounded-md border-gray-600 py-1 px-2 placeholder:text-gray-500`
            : `border rounded-md w-full h-10 mb-4 px-2 bg-secondary ${error ? "mb-1 border-red-700" : "mb-4 border-accent"}`
        }
      />

      {error && (
        <p
          className={
            isInline
              ? "text-xs text-red-500 mt-1"
              : "text-red-500 text-sm w-full text-start mb-3"
          }
        >
          {error}
        </p>
      )}
    </div>
  );
}
