import React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.HTMLAttributes<HTMLTextAreaElement> & {
  type?: string;
  name?: string;
  placeholder?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={3}
        className={cn(
          "block w-full rounded-lg border border-gray-300 p-3 text-sm",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
