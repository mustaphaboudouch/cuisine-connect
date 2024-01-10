import * as React from "react";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AppLayoutProps) => {
  return <main className="min-h-screen">{children}</main>;
};

export { AuthLayout };
