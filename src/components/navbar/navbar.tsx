import React from "react";
import Link from "next/link";

import { Logo } from "@/components/logo";

import { SignOutButton } from "./sign-out-button";

type NavbarProps = {
  userId: string | null;
};

const Navbar = ({ userId }: NavbarProps) => {
  return (
    <header className="border-b border-gray-300 bg-white">
      <div className="container flex h-20 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          {userId ? (
            <>
              <Link
                href="/recipes"
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Recettes
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Profil
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Se connecter
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                S inscrire
              </Link>
            </>
          )}
        </nav>
        {userId && <SignOutButton />}
      </div>
    </header>
  );
};

export { Navbar };
