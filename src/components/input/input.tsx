import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.HTMLAttributes<HTMLInputElement> & {
  type?: string;
  name?: string;
  placeholder?: string;
  label?: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          ref={ref}
          type="text"
          className={cn(
            "block h-12 w-full rounded-lg border border-gray-300 px-3 text-sm",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium text-red-500">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
