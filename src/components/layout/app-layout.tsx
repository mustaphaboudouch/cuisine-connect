import * as React from "react";
import { headers } from "next/headers";

import { Navbar } from "@/components/navbar";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const userId = headers().get("X-USER-ID");

  return (
    <div className="min-h-screen">
      <Navbar userId={userId} />
      <main className="container py-10">{children}</main>
    </div>
  );
};

export { AppLayout };
