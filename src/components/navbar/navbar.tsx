import React from "react";

import { Logo } from "@/components/logo";

import { UserMenu } from "./user-menu";

const Navbar = () => {
  return (
    <header className="border-b border-gray-300 bg-white">
      <div className="container flex h-20 items-center justify-between">
        <Logo />
        <UserMenu
          user={{
            id: "1",
            firstname: "John",
            lastname: "Doe",
          }}
        />
      </div>
    </header>
  );
};

export { Navbar };
