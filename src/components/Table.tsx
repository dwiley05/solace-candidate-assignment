"use client";

import { ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes } from "react";

export function TableRow({ className = "", ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`border-t ${className}`} {...rest} />;
}

export function TableCell({ className = "", ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-4 py-3 ${className}`} {...rest} />;
}

export function TableHeaderCell({ className = "", ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-4 py-3 ${className}`} {...rest} />;
}


