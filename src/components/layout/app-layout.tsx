import * as React from "react";

import { Navbar } from "@/components/navbar";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-10">{children}</main>
    </div>
  );
};

export { AppLayout };
