"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export const SignOutButton = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/sign-out`, {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Something went wrong.");
      return response.body;
    },
    onSuccess: function () {
      router.refresh();
      router.push("/sign-in");
      console.log("User signed out successfully.");
    },
    onError: function () {
      console.log("Something went wrong. Please try again.");
    },
  });

  return (
    <button onClick={() => mutate()} disabled={isPending}>
      Sign Out
    </button>
  );
};
