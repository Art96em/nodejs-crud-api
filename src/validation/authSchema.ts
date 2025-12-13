import { z } from "zod";

const email = z.email("Invalid email format");
const password = z.string().min(6, "Password must be at least 6 characters");

export const loginSchema = z.object({
  email,
  password,
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
