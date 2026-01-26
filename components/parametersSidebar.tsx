"use client";

import { useEffect } from "react";
import Image from 'next/image'
import ParametersIcon from "@/public/parameters.svg"
import UserIcon from "@/public/user.svg"

interface ParametersSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ParametersSidebar({ isOpen, setIsOpen }: ParametersSidebarProps)  {
  const tabs = {
    profile: { name: "Mon profil", icon: UserIcon },
    settings: { name: "Paramètres", icon: ParametersIcon },
  }

  /* Handle responsive sidebar visibility */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsOpen(!e.matches);
    };
    handleChange(mediaQuery);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [setIsOpen]);

  return(
    <div className={`max-w-sm border-r border-accent bg-primary ${isOpen ? 'w-5/20 xl:w-8/20  p-3' : 'w-13 p-1.5'}`}>
      <div className="flex flex-col gap-2">
        <button className={`hidden flex-row items-center gap-1 bg-secondary rounded-md border border-accent shadow-sm lg:flex ${isOpen ? 'aspect-auto h-12 px-3 p-2' : 'justify-center aspect-square h-auto p-1.5'}`} onClick={() => { setIsOpen(!isOpen) }} >{isOpen ? "<" : ">"}</button>
        {Object.entries(tabs).map(([tabKey, tab]) => (
          <div key={tabKey} className={`flex flex-row items-center gap-1 bg-secondary rounded-md border border-accent shadow-sm ${isOpen ? 'aspect-auto h-12 px-3 p-2' : 'justify-center aspect-square h-auto p-1.5'}`}>
            <div className="flex items-center justify-center h-full aspect-square">
              <Image
                src={tab.icon}
                unoptimized
                loading="eager"
                alt="icon menu profil"
                className="invert h-full aspect-square object-cover rounded-full border drag-none"
              />
            </div>
            <p className={isOpen ? 'block' : 'hidden'} >{tab.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}