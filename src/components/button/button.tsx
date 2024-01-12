import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 text-sm font-medium text-white hover:bg-slate-700",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
