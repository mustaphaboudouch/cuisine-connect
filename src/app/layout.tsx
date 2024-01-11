import type { Metadata } from "next";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/layout";
import { QueryProvider } from "@/components/query-provider";

import "@/styles/globals.css";

const metadata = {
  title: "Cuisine Connect",
  description: "AI platform for food lovers to connect and share their passion",
  icons: {
    icon: "/favicon.ico",
  },
} satisfies Metadata;

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-white font-sans text-black antialiased",
          fontSans.variable
        )}
      >
        <QueryProvider>
          <AppLayout>{children}</AppLayout>
        </QueryProvider>
      </body>
    </html>
  );
};

export default Layout;
export { metadata };
