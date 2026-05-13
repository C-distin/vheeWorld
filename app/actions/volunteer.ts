"use server"

import { Resend } from "resend"
import { VolunteerEmail } from "@/emails/volunteerEmail"
import { type VolunteerInput, volunteerSchema } from "@/lib/validation/volunteer"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitVolunteer(data: VolunteerInput) {
  const validatedData = volunteerSchema.safeParse(data)

  if (!validatedData.success) {
    return { success: false, error: "Invalid form data. Check your form inputs" }
  }

  try {
    await resend.emails.send({
      from: "Vhee World Foundation <contact@vheeworld.org>",
      to: ["vheeworld@gmail.com"],
      replyTo: validatedData.data.email,
      subject: "New Volunteer Application",
      react: VolunteerEmail(validatedData.data),
    })

    return { success: true }
  } catch (error) {
    console.error("Volunteer email failed: ", error)
    return { success: false, error: "Failed to send email. Please try again later" }
  }
}
