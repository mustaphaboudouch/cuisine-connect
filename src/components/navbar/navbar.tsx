import React from "react";

import { Logo } from "@/components/logo";

import { SignOutButton } from "./sign-out-button";

const Navbar = () => {
  return (
    <header className="border-b border-gray-300 bg-white">
      <div className="container flex h-20 items-center justify-between">
        <Logo />
        <SignOutButton />
      </div>
    </header>
  );
};

export { Navbar };
