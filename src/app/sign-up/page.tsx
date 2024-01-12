"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { signUpSchema } from "@/lib/validation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const response = await fetch(`/api/sign-up`, {
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
      console.log("User signed up successfully.");
    },
    onError: function () {
      console.log("Something went wrong. Please try again.");
    },
  });

  function onSignUp(data: SignUpFormData) {
    mutate(data);
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">S inscrire</h1>

      <form onSubmit={handleSubmit(onSignUp)} className="flex flex-col gap-4">
        <Input
          {...register("firstname")}
          error={errors.firstname && errors.firstname.message}
          label="Prénom"
          placeholder="Prénom"
        />
        <Input
          {...register("lastname")}
          error={errors.lastname && errors.lastname.message}
          label="Nom"
          placeholder="Nom"
        />
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
          S inscrire
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
