import { z } from "zod"

// --- SIGN UP SCHEMA ---
export const signUpSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .max(100, { error: "Password is too long." })
    .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { error: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { error: "Password must contain at least one special character." }),
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .max(50, { error: "Name cannot exceed 50 characters." }),
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters long." })
    .max(20, { error: "Username cannot exceed 20 characters." })
    .regex(/^[a-z0-9_]+$/, { error: "Username can only contain lowercase letters, numbers, and underscores." }),
})

export type SignUpInput = z.infer<typeof signUpSchema>

// --- SIGN IN SCHEMA ---
export const signInSchema = z.object({
  username: z.string().min(3, { error: "Please enter a valid email or username." }),
  password: z.string().min(1, { error: "Password is required." }),
})

export type SignInInput = z.infer<typeof signInSchema>
