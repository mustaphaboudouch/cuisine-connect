import * as React from "react";

import { cn } from "@/lib/utils";

import { ICON_MAPPING, type IconName } from "./icon-mapping";

type IconProps = React.SVGAttributes<SVGElement> & {
  name: IconName;
};

const Icon = ({ name, className, ...props }: IconProps) => {
  const IconComponent = ICON_MAPPING[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("shrink-0", className)}
      {...props}
    >
      <IconComponent />
    </svg>
  );
};

export { Icon };
