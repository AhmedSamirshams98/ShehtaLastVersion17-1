"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: "primary" | "secondary" | "secondarySpecial" | "primaryspeciallogout";
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode; // إضافة أيقونة
}

export const Button = ({ kind = "primary", children }: ButtonProps) => {
  const variantClasses = {
    primary:
      "bg-[#FDB800]  text-black  text-[3.3vw]  md:text-[2vw] lg:text-[1.5vw]  w-[30vw] md:w-[20vw] lg:w-[18vw] h-[7vw] md:h-[4vw]  lg:h-[3vw] rounded-[42.5px]  cursor-pointer",
    secondary:
      "bg-black text-white text-[3.3vw]  md:text-[2vw] lg:text-[1.5vw] w-[30vw] md:w-[20vw] h-[7vw] md:h-[4vw]  lg:h-[3vw]  rounded-[42.2px] cursor-pointer mt-[6%] md:mt-[2%] ",

    secondarySpecial:
      "bg-black text-white w-[44vw] md:w-[40vw] lg:w-[18vw]   p-[2.5%] lg:p-[1%]  text-[4vw] lg:text-[1.6vw] rounded-[42.2px]  cursor-pointer ",
    primaryspeciallogout:
      "bg-red-700  text-white  text-[3vw]  md:text-[2vw] w-[28vw] md:w-[20vw] h-[6vw] md:h-[4vw]  rounded-[42.5px]  cursor-pointer",
  };

  return (
    <button
      className={`
        ${variantClasses[kind]} 
      `}
    >
      {children}
    </button>
  );
};
