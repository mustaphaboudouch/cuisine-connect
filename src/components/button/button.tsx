import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icon";

type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: string;
  icon?: IconName;
  isFullWidth?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, icon, isFullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(
          "mr-10 inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary-200 px-6 align-middle font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 enabled:hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-50",
          { "flex w-full justify-center": isFullWidth },
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && <Icon name={icon} className="-ml-1 h-5 w-5" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
