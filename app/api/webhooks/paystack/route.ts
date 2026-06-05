import { createHmac, timingSafeEqual } from "node:crypto"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { donations, recurringAuthorizations } from "@/lib/db/schema"

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY as string

// SSE clients
const clients = new Map<string, ReadableStreamDefaultController>()

export function addClient(ref: string, controller: ReadableStreamDefaultController) {
  clients.set(ref, controller)
}

export function removeClient(ref: string) {
  clients.delete(ref)
}

export function notifyClient(ref: string, data: unknown) {
  const controller = clients.get(ref)
  if (controller) {
    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
  }
}

function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET).update(body).digest("hex")
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("x-paystack-signature")

  if (!signature || !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(body)

  // Respond immediately, process async
  processWebhookEvent(event).catch(console.error)

  return NextResponse.json({ received: true })
}

async function processWebhookEvent(event: {
  event: string
  data: {
    reference: string
    status: string
    id: number
    authorization?: {
      authorization_code: string
      last4: string
      card_type: string
      bank: string
      reusable: boolean
      signature: string
    }
    customer: { email: string }
    amount: number
    metadata?: { donationId?: number; frequency?: string; name?: string }
  }
}) {
  const { data } = event

  switch (event.event) {
    case "charge.success": {
      const donation = await db.query.donations.findFirst({
        where: eq(donations.reference, data.reference),
      })

      if (!donation || donation.status === "success") {
        notifyClient(data.reference, { status: "success", alreadyProcessed: true })
        return
      }

      const [updated] = await db
        .update(donations)
        .set({
          status: "success",
          paystackTxId: data.id.toString(),
          authorizationCode: data.authorization?.authorization_code,
        })
        .where(eq(donations.reference, data.reference))
        .returning()

      // Save recurring authorization
      if (data.metadata?.frequency === "monthly" && data.authorization?.reusable) {
        const auth = data.authorization

        await db
          .insert(recurringAuthorizations)
          .values({
            email: data.customer.email,
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

      notifyClient(data.reference, {
        status: "success",
        donation: updated,
        authorization: data.authorization,
      })
      break
    }

    case "charge.failed": {
      await db.update(donations).set({ status: "failed" }).where(eq(donations.reference, data.reference))

      notifyClient(data.reference, { status: "failed" })
      break
    }

    case "invoice.payment_succeeded": {
      // Handle subscription renewals
      break
    }
  }
}
