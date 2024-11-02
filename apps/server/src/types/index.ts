import z from "zod";

const userRole = z.enum(["admin", "user"]);

export const signUpData = z.object({
  username: z.string(),
  password: z.string(),
  type: userRole.optional(),
});

export const signInData = z.object({
  username: z.string(),
  password: z.string(),
});
