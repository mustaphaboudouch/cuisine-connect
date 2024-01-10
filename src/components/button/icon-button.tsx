import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icon";

type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  icon: IconName;
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-200 align-middle text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 enabled:hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        <Icon name={icon} className="h-5 w-5" />
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton };
