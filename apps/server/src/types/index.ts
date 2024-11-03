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

export interface UserData {
  id: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      role?: string;
    }
  }
}
