"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "default" | "outline";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2 text-base",
};

const variantClasses: Record<Variant, string> = {
  default: "rounded-md border border-gray-300 hover:bg-gray-50",
  outline: "rounded-md border border-gray-300 bg-transparent hover:bg-gray-50",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`${variantClasses[variant]} ${sizeClasses[size]} disabled:opacity-50 ${className}`}
        disabled={disabled}
        {...rest}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;


