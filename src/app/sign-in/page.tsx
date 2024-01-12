"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { signInSchema } from "@/lib/validation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

type SignInFormData = z.infer<typeof signInSchema>;

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignInFormData) => {
      const response = await fetch(`/api/sign-in`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Something went wrong.");
      return response.body;
    },
    onSuccess: function () {
      router.refresh();
      router.replace("/recipes");
      window.location.reload();
      console.log("User signed in successfully.");
    },
    onError: function () {
      console.log("Something went wrong. Please try again.");
    },
  });

  function onSignIn(data: SignInFormData) {
    mutate(data);
  }

  return (
    <main>
      <h1 className="mb-6 text-3xl font-bold">Se connecter</h1>

      <form onSubmit={handleSubmit(onSignIn)} className="flex flex-col gap-4">
        <Input
          {...register("email")}
          error={errors.email && errors.email.message}
          type="email"
          label="Adresse email"
          placeholder="Adresse email"
        />
        <Input
          {...register("password")}
          error={errors.password && errors.password.message}
          type="password"
          label="Mot de passe"
          placeholder="Mot de passe"
        />
        <Button type="submit" disabled={isPending}>
          Se connecter
        </Button>
      </form>
    </main>
  );
}
