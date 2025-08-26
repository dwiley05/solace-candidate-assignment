"use client";

import { HTMLAttributes } from "react";

type PillProps = HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
};

export default function Pill({ children, className = "", ...rest }: PillProps) {
  return (
    <span
      className={`rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}


