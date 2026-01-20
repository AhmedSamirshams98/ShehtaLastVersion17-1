"use client";

import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  register?: UseFormRegisterReturn;
}

export function RequestInput({
  label,
  name,
  type = "text",
  placeholder,
  error,
  disabled,
  required,
  className,
  inputClassName,
  labelClassName,
  register,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Label
        htmlFor={name}
        className={cn(labelClassName, "text-2xl text-primary font-bold")}
      >
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          inputClassName,
          "bg-background py-6 md:py-7",
          "text-xl md:text-2xl font-semibold",
          "min-h-[56px] md:min-h-[64px]",
          "placeholder:text-xl md:placeholder:text-2xl placeholder:font-semibold"
        )}
        {...register}
      />
      {error && (
        <p
          id={`${name}-error`}
          className=""
          role="alert"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

