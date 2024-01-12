"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { signInSchema } from "@/lib/validation";

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
      router.push("/recipes");
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
      <h1 className="text-xl font-bold">Sign In</h1>

      <form onSubmit={handleSubmit(onSignIn)}>
        <input {...register("email")} type="email" placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <button type="submit" disabled={isPending}>
          Sign In
        </button>
      </form>
    </main>
  );
}
