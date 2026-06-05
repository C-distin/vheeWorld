"use server"

const PAYSTACK_BASE = "https://api.paystack.co"

interface InitializeTransactionParams {
  email: string
  amount: number // in pesewas (smallest currency unit)
  reference: string
  callbackUrl: string
  metadata?: Record<string, unknown>
  plan?: string // for subscriptions
  channels?: string[] // e.g. ["card", "mobile_money", "bank_transfer"]
}

interface PaystackResponse<T> {
  status: boolean
  message: string
  data: T
}

interface InitializeData {
  authorization_url: string
  access_code: string
  reference: string
}

interface VerificationData {
  id: number
  status: "success" | "abandoned" | "failed"
  reference: string
  amount: number
  message: string | null
  gateway_response: string
  paid_at: string | null
  created_at: string
  channel: string
  currency: string
  ip_address: string | null
  metadata: Record<string, unknown>
  log: unknown
  fees: number | null
  fees_split: unknown
  authorization: {
    authorization_code: string
    bin: string
    last4: string
    exp_month: string
    exp_year: string
    channel: string
    card_type: string
    bank: string
    country_code: string
    brand: string
    reusable: boolean
    signature: string
    account_name: string | null
  } | null
  customer: {
    id: number
    first_name: string | null
    last_name: string | null
    email: string
    customer_code: string
    phone: string | null
    metadata: unknown
    risk_action: string
  }
  plan: string | null
  subaccount: unknown
  order_id: string | null
  paidAt: string | null
  createdAt: string
  requested_amount: number | null
}

interface ChargeAuthorizationData {
  amount: number
  currency: string
  transaction_date: string
  status: "success" | "failed" | "pending"
  reference: string
  domain: string
  metadata: Record<string, unknown>
  gateway_response: string
  message: string | null
  channel: string
  ip_address: string | null
  log: unknown
  fees: number | null
  authorization: {
    authorization_code: string
    bin: string
    last4: string
    exp_month: string
    exp_year: string
    channel: string
    card_type: string
    bank: string
    country_code: string
    brand: string
    reusable: boolean
    signature: string
    account_name: string | null
  }
  customer: {
    id: number
    first_name: string | null
    last_name: string | null
    email: string
    customer_code: string
    phone: string | null
    metadata: unknown
    risk_action: string
  }
  plan: string | null
  id: number
}

interface PlanData {
  name: string
  amount: number
  interval: string
  integration: number
  domain: string
  currency: string
  plan_code: string
  invoicing_interval: string | null
  send_invoices: boolean
  send_sms: boolean
  hosted_page: boolean
  migrate: boolean
  id: number
  createdAt: string
  updatedAt: string
}

interface SubscriptionData {
  customer: number
  plan: number
  integration: number
  domain: string
  start: number
  status: "active" | "non-renewing" | "cancelled" | "disabled"
  quantity: number
  amount: number
  subscription_code: string
  email_token: string
  id: number
  createdAt: string
  updatedAt: string
}

// ── Core API Functions ────────────────────────────────────────────────────────

export async function initializeTransaction(
  params: InitializeTransactionParams
): Promise<PaystackResponse<InitializeData>> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
      plan: params.plan,
      channels: params.channels ?? ["card", "mobile_money", "bank_transfer"],
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack initialize failed: ${error}`)
  }

  return res.json()
}

export async function verifyTransaction(reference: string): Promise<PaystackResponse<VerificationData>> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
    // Cache for 5 seconds to avoid duplicate verifications
    next: { revalidate: 5 },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack verify failed: ${error}`)
  }

  return res.json()
}

export async function chargeAuthorization({
  authorizationCode,
  email,
  amount,
  reference,
  metadata,
}: {
  authorizationCode: string
  email: string
  amount: number
  reference: string
  metadata?: Record<string, unknown>
}): Promise<PaystackResponse<ChargeAuthorizationData>> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/charge_authorization`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authorization_code: authorizationCode,
      email,
      amount,
      reference,
      metadata,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack charge authorization failed: ${error}`)
  }

  return res.json()
}

// ── Subscription / Recurring Functions ────────────────────────────────────────

export async function createPlan({
  name,
  amount,
  interval,
}: {
  name: string
  amount: number
  interval: "daily" | "weekly" | "monthly" | "quarterly" | "annually"
}): Promise<PaystackResponse<PlanData>> {
  const res = await fetch(`${PAYSTACK_BASE}/plan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, amount, interval }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack create plan failed: ${error}`)
  }

  return res.json()
}

export async function createSubscription({
  customer,
  plan,
  authorization,
  start_date,
}: {
  customer: string // customer email or code
  plan: string // plan code
  authorization?: string // authorization code (optional for existing customers)
  start_date?: string // ISO date string
}): Promise<PaystackResponse<SubscriptionData>> {
  const body: Record<string, string> = { customer, plan }
  if (authorization) body.authorization = authorization
  if (start_date) body.start_date = start_date

  const res = await fetch(`${PAYSTACK_BASE}/subscription`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack create subscription failed: ${error}`)
  }

  return res.json()
}

export async function disableSubscription({
  code,
  token,
}: {
  code: string // subscription code
  token: string // email token
}): Promise<PaystackResponse<{ message: string }>> {
  const res = await fetch(`${PAYSTACK_BASE}/subscription/disable`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, token }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack disable subscription failed: ${error}`)
  }

  return res.json()
}

export async function enableSubscription({
  code,
  token,
}: {
  code: string
  token: string
}): Promise<PaystackResponse<{ message: string }>> {
  const res = await fetch(`${PAYSTACK_BASE}/subscription/enable`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, token }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack enable subscription failed: ${error}`)
  }

  return res.json()
}

// ── Utility Functions ─────────────────────────────────────────────────────────

export async function resolveBVN(bvn: string) {
  const res = await fetch(`${PAYSTACK_BASE}/bank/resolve_bvn/${bvn}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack BVN resolve failed: ${error}`)
  }

  return res.json()
}

export async function fetchBanks(country: "nigeria" | "ghana" | "south africa" = "ghana") {
  const res = await fetch(`${PAYSTACK_BASE}/bank?country=${country}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
    // Cache for 1 hour — banks don't change often
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack fetch banks failed: ${error}`)
  }

  return res.json()
}

export async function resolveAccount({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) {
  const res = await fetch(`${PAYSTACK_BASE}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Paystack account resolve failed: ${error}`)
  }

  return res.json()
}
