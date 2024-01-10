"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";

type User = {
  id: string;
  firstname: string;
  lastname: string;
};

type UserMenuProps = {
  user: User;
};

const UserMenu = ({ user }: UserMenuProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex items-center gap-2 rounded-xl pr-2 outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2">
        <Avatar firstname={user.firstname} lastname={user.lastname} />
        <span className="font-medium capitalize">
          {user.firstname} {user.lastname}
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          align="end"
          className="min-w-52 rounded-xl border border-gray-200 bg-white py-3"
        >
          <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 px-4 py-2 outline-none focus:bg-gray-100">
            <Icon name="mic" className="h-5 w-5" />
            <span className="font-medium">Profil</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 px-4 py-2 outline-none focus:bg-gray-100">
            <Icon name="mic" className="h-5 w-5" />
            <span className="font-medium">Déconnecter</span>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="fill-gray-200" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export { UserMenu };
