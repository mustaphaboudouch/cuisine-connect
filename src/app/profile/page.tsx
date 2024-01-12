"use client";

import type { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error!</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Profil</h1>

      <UpdateProfileForm user={user!} />
    </div>
  );
};

export default Page;
