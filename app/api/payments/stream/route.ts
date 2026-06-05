import type { NextRequest } from "next/server"
import { addClient, removeClient } from "../../webhooks/paystack/route"

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference")
  if (!reference) {
    return new Response("Reference required", { status: 400 })
  }

  const encoder = new TextEncoder()
  let controller: ReadableStreamDefaultController

  const stream = new ReadableStream({
    start(c) {
      controller = c
      addClient(reference, controller)
      // Send initial connection message
      c.enqueue(encoder.encode(`data: ${JSON.stringify({ connected: true })}\n\n`))
    },
    cancel() {
      removeClient(reference)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
