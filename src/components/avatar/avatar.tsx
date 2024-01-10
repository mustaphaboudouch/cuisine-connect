import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { getUserTwoLetters } from "@/lib/utils";

type AvatarProps = {
  firstname: string;
  lastname: string;
};

const Avatar = ({ firstname, lastname }: AvatarProps) => {
  const name = getUserTwoLetters(firstname, lastname);

  return (
    <>
      <AvatarPrimitive.Root className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200">
        <AvatarPrimitive.Fallback className="font-medium">
          {name}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    </>
  );
};

export { Avatar };
