"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChefHatIcon } from "lucide-react";

import { Button } from "../button";
import { Chat } from "../chat";

const Popover = () => {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <Button className="fixed bottom-10 right-10 h-20 w-20 rounded-full">
          <ChefHatIcon />
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content align="end" side="top" sideOffset={5}>
          <div className="flex h-[400px] w-[400px] max-w-[400px] flex-col overflow-hidden rounded-lg border border-gray-300 bg-white">
            <Chat />
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export { Popover };
