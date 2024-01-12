"use client";

import type { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { UpdateProfileForm } from "./update-profile-form";

const Page = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async function () {
      const res = await fetch("/api/user");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div>
        <LoaderIcon className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full border border-red-600 bg-red-50 p-4 text-sm font-medium">
        Something went wrong. Please reload the page.
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Profil</h1>

      <UpdateProfileForm user={user!} />
    </div>
  );
};

export default Page;
