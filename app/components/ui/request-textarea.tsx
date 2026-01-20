"use client";

import { Textarea } from "./textarea";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface RequestTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  textareaClassName?: string;
  labelClassName?: string;
  register?: UseFormRegisterReturn;
  rows?: number;
}

export function RequestTextarea({
  label,
  name,
  placeholder,
  error,
  disabled,
  required,
  className,
  textareaClassName,
  labelClassName,
  register,
  rows = 4,
}: RequestTextareaProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Label
        htmlFor={name}
        className={cn(labelClassName, "text-2xl text-primary font-bold")}
      >
        {label}
      </Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          textareaClassName,
          "bg-background py-4 md:py-6",
          "text-lg md:text-xl font-semibold",
          "placeholder:text-lg md:placeholder:text-xl placeholder:font-semibold"
        )}
        {...register}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-sm"
          role="alert"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

