"use server"

import { Resend } from "resend"
import { ContactEmail } from "@/emails/contactEmail"
import { type ContactInput, contactSchema } from "@/lib/validation/contact"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContact(data: ContactInput) {
  const validatedData = contactSchema.safeParse(data)

  if (!validatedData.success) {
    return { success: false, error: "Invalid form data. Check your form inputs" }
  }

  try {
    await resend.emails.send({
      from: "Vhee World Foundation <contact@vheeworld.org>",
      to: ["vheeworld@gmail.com"],
      replyTo: validatedData.data.email,
      subject: validatedData.data.subject,
      react: ContactEmail(validatedData.data),
    })

    return { success: true }
  } catch (error) {
    console.error("Contact email failed: ", error)
    return { success: false, error: "Failed to send email. Please try again later" }
  }
}
