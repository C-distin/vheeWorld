import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(2, { error: "Name is too short" }).max(50, { error: "Name is too long" }),
  email: z.email({ error: "Email is invalid" }),
  subject: z.string().min(2, { error: "Subject is too short" }).max(120, { error: "Subject is too long" }),
  message: z.string().min(10, { error: "Message is too short" }).max(5000, { error: "Message is too long" }),
})

export type ContactInput = z.infer<typeof contactSchema>
