"use client";

interface ButtonProps {
  formAction?: (formData: FormData) => void | Promise<void>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
  variant?: "primary" | "secondary" | "accept" | "refuse";
  loading?: boolean;
}

export default function Button({formAction, onClick, text, variant = "primary", loading = false}: ButtonProps)  {
  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "h-12 min-w-36 rounded-md bg-orange-400 text-black p-2 cursor-pointer transition duration-250 hover:bg-orange-500 disabled:bg-gray-400",
    secondary: "h-10 min-w-28 text-sm rounded-md bg-orange-400 text-black p-2 cursor-pointer transition duration-250 hover:bg-orange-500 disabled:bg-gray-400",
    accept: "h-10 min-w-28 text-sm rounded-md bg-green-600 text-black p-2 cursor-pointer transition duration-250 hover:bg-green-400 disabled:bg-gray-400",
    refuse: "h-10 min-w-28 text-sm rounded-md bg-red-500 text-black p-2 cursor-pointer transition duration-250 hover:bg-red-400 disabled:bg-gray-400",
  };

  return(
    <button
      className={styles[variant]}
      formAction={formAction}
      onClick={onClick}
      type={formAction ? "submit" : "button"}
      disabled={loading}
    >
      {text}
    </button>
  )
}