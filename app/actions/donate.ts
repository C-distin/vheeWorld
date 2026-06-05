"use server"

import { and, desc, eq } from "drizzle-orm"
import { Resend } from "resend"
import { z } from "zod"
import { DonationReceiptEmail } from "@/emails/donation-receipt"
import { db } from "@/lib/db"
import { donations, recurringAuthorizations } from "@/lib/db/schema"
import { chargeAuthorization, initializeTransaction, verifyTransaction } from "./paystack"

const resend = new Resend(process.env.RESEND_API_KEY)

const donateSchema = z.object({
  email: z.email(),
  name: z.string().min(2),
  amount: z.number().min(100), // minimum 1 GHS (100 pesewas)
  frequency: z.enum(["one-time", "monthly"]),
  phone: z.string().optional(),
})

export type DonateFormData = z.infer<typeof donateSchema>

function generateReference(): string {
  return `VHEE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

export async function initiateDonation(data: DonateFormData) {
  const parsed = donateSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid donation data" }
  }

  const { email, name, amount, frequency, phone } = parsed.data
  const reference = generateReference()

  // Create pending donation
  const [donation] = await db
    .insert(donations)
    .values({
      email,
      name,
      amount,
      currency: "GHS",
      frequency,
      reference,
      status: "pending",
      metadata: { phone },
    })
    .returning()

  // Initialize Paystack
  const paystackData = await initializeTransaction({
    email,
    amount,
    reference,
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/donate/verify?reference=${reference}`,
    metadata: {
      donationId: donation.id,
      frequency,
      name,
      phone,
      custom_fields: [
        { display_name: "Donor Name", variable_name: "donor_name", value: name },
        { display_name: "Frequency", variable_name: "frequency", value: frequency },
      ],
    },
  })

  if (!paystackData.status) {
    await db.update(donations).set({ status: "failed" }).where(eq(donations.id, donation.id))

    return { success: false, error: paystackData.message || "Payment initialization failed" }
  }

  return {
    success: true,
    authorizationUrl: paystackData.data.authorization_url,
    reference,
  }
}

export async function verifyDonation(reference: string) {
  const donation = await db.query.donations.findFirst({
    where: eq(donations.reference, reference),
  })

  if (!donation) {
    return { success: false, error: "Donation not found" }
  }

  if (donation.status === "success") {
    return { success: true, donation }
  }

  const verification = await verifyTransaction(reference)

  if (verification.status && verification.data.status === "success") {
    const [updated] = await db
      .update(donations)
      .set({
        status: "success",
        paystackTxId: verification.data.id.toString(),
        authorizationCode: verification.data.authorization?.authorization_code,
      })
      .where(eq(donations.reference, reference))
      .returning()

    // Save recurring authorization
    if (donation.frequency === "monthly" && verification.data.authorization?.reusable) {
      const auth = verification.data.authorization

      await db
        .insert(recurringAuthorizations)
        .values({
          email: donation.email,
          authorizationCode: auth.authorization_code,
          last4: auth.last4,
          cardType: auth.card_type,
          bank: auth.bank,
          reusable: auth.reusable,
          signature: auth.signature,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: recurringAuthorizations.signature,
          set: {
            authorizationCode: auth.authorization_code,
            isActive: true,
            updatedAt: new Date(),
          },
        })
    }

    // Send receipt
    await resend.emails.send({
      from: "VheeWorld Foundation <donations@vheeworld.org>",
      to: [donation.email],
      subject: "Thank you for your donation to VheeWorld Foundation",
      react: DonationReceiptEmail({
        name: donation.name,
        amount: donation.amount,
        currency: donation.currency,
        frequency: donation.frequency,
        reference: donation.reference,
        date: donation.createdAt,
      }),
    })

    return { success: true, donation: updated }
  }

  await db.update(donations).set({ status: "failed" }).where(eq(donations.reference, reference))

  return { success: false, error: "Payment verification failed" }
}

export async function processRecurringDonation({ email, amount }: { email: string; amount: number }) {
  const auth = await db.query.recurringAuthorizations.findFirst({
    where: and(eq(recurringAuthorizations.email, email), eq(recurringAuthorizations.isActive, true)),
    orderBy: desc(recurringAuthorizations.createdAt),
  })

  if (!auth) {
    return { success: false, error: "No active payment method found" }
  }

  const reference = generateReference()

  const result = await chargeAuthorization({
    authorizationCode: auth.authorizationCode,
    email,
    amount,
    reference,
  })

  if (result.status && result.data.status === "success") {
    await db.insert(donations).values({
      email,
      name: auth.email.split("@")[0],
      amount,
      currency: "GHS",
      frequency: "monthly",
      reference,
      status: "success",
      paystackTxId: result.data.id.toString(),
      authorizationCode: auth.authorizationCode,
    })

    return { success: true, reference }
  }

  return { success: false, error: result.message || "Recurring charge failed" }
}
