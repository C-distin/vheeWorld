import { z } from "zod"

export const volunteerSchema = z.object({
  name: z.string().min(2, { error: "Name is too short" }).max(50, { error: "Name is too long" }),
  email: z.email({ error: "Email is invalid" }),
  skills: z.array(z.string().min(1)),
  availability: z.string().min(1),
  motivation: z.string().min(10, { error: "Motivation is too short" }).max(5000, { error: "Motivation is too long" }),
})

export type VolunteerInput = z.infer<typeof volunteerSchema>
