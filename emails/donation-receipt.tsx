import { Body, Container, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components"

interface DonationReceiptEmailProps {
  name: string
  amount: number
  currency: string
  frequency: string
  reference: string
  date: Date
}

export function DonationReceiptEmail({
  name,
  amount,
  currency,
  frequency,
  reference,
  date,
}: DonationReceiptEmailProps) {
  const formattedAmount = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
  }).format(amount / 100)

  return (
    <Html lang="en">
      <Tailwind>
        <Head />
        <Preview>Thank you for your donation to VheeWorld Foundation</Preview>
        <Body className="font-sans bg-gray-50 py-10">
          <Container className="max-w-[600px] mx-auto bg-white rounded-2xl overflow-hidden shadow-lg">
            <Section
              className="px-10 py-12 text-center"
              style={{ background: "linear-gradient(135deg, #140021 0%, #2D1B69 100%)" }}>
              <Text className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-4">THANK YOU</Text>
              <Heading className="text-white text-3xl font-bold mb-2">Your Donation Receipt</Heading>
              <Text className="text-purple-200 text-sm">Every cedi brings dignity to those who need it most.</Text>
            </Section>

            <Section className="px-10 py-8">
              <Text className="text-gray-600 text-base mb-6">Dear {name},</Text>
              <Text className="text-gray-600 text-sm leading-relaxed mb-6">
                Thank you for your generous {frequency} donation of{" "}
                <strong className="text-gray-900">{formattedAmount}</strong> to VheeWorld Foundation. Your contribution
                directly supports education, mentorship, and mental health programs for vulnerable children in Ghana.
              </Text>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Donation Details</Text>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-500 m-0">Amount</Text>
                    <Text className="text-sm font-bold text-gray-900 m-0">{formattedAmount}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-500 m-0">Frequency</Text>
                    <Text className="text-sm font-bold text-gray-900 m-0 capitalize">{frequency}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-500 m-0">Reference</Text>
                    <Text className="text-sm font-mono text-gray-900 m-0">{reference}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-500 m-0">Date</Text>
                    <Text className="text-sm text-gray-900 m-0">
                      {date.toLocaleDateString("en-GH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </div>
                </div>
              </div>

              <Text className="text-sm text-gray-500 text-center">
                This receipt serves as official confirmation of your donation.
                <br />
                VheeWorld Foundation is a registered NGO in Ghana.
              </Text>
            </Section>

            <Section className="px-10 py-6 border-t border-gray-100 text-center">
              <Link href="https://vhee-world.vercel.app" className="text-purple-600 text-sm font-semibold no-underline">
                vhee-world.vercel.app
              </Link>
              <Text className="text-xs text-gray-400 mt-2">"Streetism should not be an option."</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
