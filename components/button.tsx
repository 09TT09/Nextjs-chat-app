"use client";

import Image from 'next/image'

interface ButtonProps {
  formAction?: (formData: FormData) => void | Promise<void>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  text?: string;
  variant?: "primary" | "secondary" | "accept" | "refuse" | "icon" | "icon2";
  loading?: boolean;
  imgSrc?: any;
  imgAlt?: string;
  imgColorInverted?: boolean 
}

export default function Button({formAction, onClick, text, variant = "primary", loading = false, imgSrc, imgAlt = "", imgColorInverted = false}: ButtonProps)  {
  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "shrink-0 h-12 min-w-36 rounded-md bg-orange-400 text-black p-2 cursor-pointer transition duration-250 hover:bg-orange-500 disabled:bg-gray-400",
    secondary: "shrink-0 h-10 min-w-28 text-sm rounded-md bg-orange-400 text-black p-2 cursor-pointer transition duration-250 hover:bg-orange-500 disabled:bg-gray-400",
    accept: "shrink-0 h-8 min-w-20 text-sm rounded-md bg-green-600 text-black p-2 cursor-pointer transition duration-250 hover:bg-green-400 disabled:bg-gray-400 xs:min-w-28 sm:h-10 lg:h-8 xl:h-10",
    refuse: "shrink-0 h-8 min-w-20 text-sm rounded-md bg-red-500 text-black p-2 cursor-pointer transition duration-250 hover:bg-red-400 disabled:bg-gray-400 xs:min-w-28 sm:h-10 lg:h-8 xl:h-10",
    icon: "shrink-0 h-10 w-10 text-sm rounded-md bg-orange-400 text-black p-2 cursor-pointer transition duration-250 hover:bg-orange-500 disabled:bg-gray-400",
    icon2: "shrink-0 flex justify-center items-center h-10 w-10 text-sm rounded-md bg-red-500 text-black p-2 cursor-pointer transition duration-250 hover:bg-red-400 disabled:bg-gray-400",
  };

  return(
    <button
      className={styles[variant]}
      formAction={formAction}
      onClick={onClick}
      type={formAction ? "submit" : "button"}
      disabled={loading}
    >
      {imgSrc
        ? ( <Image src={imgSrc} width={25} height={25} alt={imgAlt} className={`${imgColorInverted && "invert"}`} /> )
        : ( text )}
    </button>
  )
}