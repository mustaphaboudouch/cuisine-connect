"use client";

import { useMutation } from "@tanstack/react-query";

const Page = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("Something went wrong");
      return response.body;
    },
    onSuccess: function () {
      console.log("Database seeded successfully");
    },
    onError: function () {
      console.log("Something went wrong. Please try again.");
    },
  });

  return (
    <>
      <h1>Cuisine Connect</h1>
      <button onClick={() => mutate()}>
        Seed database {isPending && <span>Loading...</span>}
      </button>
    </>
  );
};

export default Page;
