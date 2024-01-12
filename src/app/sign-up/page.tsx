"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { signUpSchema } from "@/lib/validation";

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
      router.push("/recipes");
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
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit(onSignUp)}>
        <input
          {...register("firstname")}
          type="text"
          placeholder="First Name"
        />
        {errors.firstname && <p>{errors.firstname.message}</p>}
        <input {...register("lastname")} type="text" placeholder="Last Name" />
        {errors.lastname && <p>{errors.lastname.message}</p>}
        <input {...register("email")} type="email" placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <button type="submit" disabled={isPending}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
