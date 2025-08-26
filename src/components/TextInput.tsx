"use client";

import { InputHTMLAttributes, forwardRef } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  containerClassName?: string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { id, label, hint, className = "", containerClassName = "", ...rest },
    ref
  ) => {
    const inputId = id || rest.name;
    return (
      <div className={containerClassName}>
        {label ? (
          <label htmlFor={inputId} className="text-sm text-gray-600">
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          type="text"
          className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          {...rest}
        />
        {hint ? <p className="text-sm text-gray-500">{hint}</p> : null}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;


