"use client";

import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { Button } from "@/components/button";

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
    <div className="flex flex-col items-center text-center">
      <h1 className="mb-4 text-3xl font-bold">Cuisine Connect</h1>

      <p className="mb-3 max-w-md text-sm">
        Appuyez sur le bouton pour remplir la base de données avec des données
        aléatoires.
      </p>

      <Button onClick={() => mutate()} disabled={isPending}>
        {isPending && <LoaderIcon className="h-4 w-4 animate-spin" />}
        <span>Remplir la base de données</span>
      </Button>
    </div>
  );
};

export default Page;
