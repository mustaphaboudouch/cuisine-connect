import * as z from "zod";

const signUpSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const updateProfileSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  allergens: z.array(z.string()),
});

const updatePasswordSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
    newPassword: z.string().min(8),
  })
  .refine(({ password, passwordConfirm }) => password !== passwordConfirm, {
    message: "Passwords did not match",
    path: ["passwordConfirm"],
  });

export {
  signUpSchema,
  signInSchema,
  updateProfileSchema,
  updatePasswordSchema,
};
