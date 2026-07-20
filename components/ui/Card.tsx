import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-gray-200 bg-white p-5 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
