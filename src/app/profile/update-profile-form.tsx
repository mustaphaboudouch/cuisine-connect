"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { updateProfileSchema } from "@/lib/validation";
import { queryClient } from "@/components/query-provider";

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

type UpdateProfileFormProps = {
  user: Partial<User>;
};

export const UpdateProfileForm = ({ user }: UpdateProfileFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateProfileFormData) => {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Something went wrong.");
      return response.body;
    },
    onSuccess: async function () {
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("User profile updated successfully.");
    },
    onError: function () {
      console.log("Something went wrong. Please try again.");
    },
  });

  function onSubmit(data: UpdateProfileFormData) {
    mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstname")} type="text" placeholder="First Name" />
      {errors.firstname && <p>{errors.firstname.message}</p>}
      <input {...register("lastname")} type="text" placeholder="Last Name" />
      {errors.lastname && <p>{errors.lastname.message}</p>}
      <button type="submit" disabled={isPending}>
        Update
      </button>
    </form>
  );
};
