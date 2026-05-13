import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

interface VolunteerEmailProps {
  name: string
  email: string
  skills: string[]
  availability: string
  motivation: string
}

export function VolunteerEmail({ name, email, skills, availability, motivation }: VolunteerEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>New volunteer application from {name} — Join Our Community</Preview>
        <Body className="font-sans bg-gray-50 py-[40px]">
          <Container className="max-w-[600px] mx-auto bg-white">
            {/* Hero Header */}
            <Section
              className="px-[40px] pt-[48px] pb-[56px] text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #140021 0%, #1E0033 50%, #2D1B69 100%)",
              }}>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(192, 132, 252, 0.3) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <Text className="text-[#FACC15] text-[12px] font-semibold tracking-[2px] uppercase mb-[16px] m-0">
                NEW VOLUNTEER APPLICATION
              </Text>

              <Heading className="text-white text-[36px] font-bold leading-[1.1] mb-[16px] m-0">
                Community of <span className="italic text-[#C084FC]">Change-Makers</span>
              </Heading>

              <Text className="text-gray-300 text-[16px] leading-[1.6] max-w-[400px] mx-auto m-0">
                Someone wants to join the mission. Review their application below.
              </Text>
            </Section>

            {/* Application Card */}
            <Section className="px-[40px] py-[40px]">
              <div
                className="bg-[#F8F8FC] rounded-[16px] p-[32px] border border-gray-100"
                style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
                <Heading className="text-[#1F2937] text-[20px] font-bold mb-[24px] m-0">Applicant Details</Heading>

                <div className="mb-[20px]">
                  <Text className="text-[#6B7280] text-[12px] font-semibold uppercase tracking-[1px] mb-[4px] m-0">
                    Full Name
                  </Text>
                  <Text className="text-[#1F2937] text-[16px] font-medium m-0">{name}</Text>
                </div>

                <div className="mb-[20px]">
                  <Text className="text-[#6B7280] text-[12px] font-semibold uppercase tracking-[1px] mb-[4px] m-0">
                    Email Address
                  </Text>
                  <Link
                    href={`mailto:${email}`}
                    className="text-[#7C3AED] text-[16px] font-medium no-underline hover:underline">
                    {email}
                  </Link>
                </div>

                <div className="mb-[20px]">
                  <Text className="text-[#6B7280] text-[12px] font-semibold uppercase tracking-[1px] mb-[4px] m-0">
                    Skills
                  </Text>
                  <Text className="text-[#1F2937] text-[16px] font-medium m-0">{skills.join(", ")}</Text>
                </div>

                <div className="mb-[20px]">
                  <Text className="text-[#6B7280] text-[12px] font-semibold uppercase tracking-[1px] mb-[4px] m-0">
                    Availability
                  </Text>
                  <Text className="text-[#1F2937] text-[16px] font-medium m-0">{availability}</Text>
                </div>

                <div>
                  <Text className="text-[#6B7280] text-[12px] font-semibold uppercase tracking-[1px] mb-[4px] m-0">
                    Why VheeWorld?
                  </Text>
                  <Text className="text-[#1F2937] text-[16px] leading-[1.6] m-0">{motivation}</Text>
                </div>
              </div>
            </Section>

            {/* Contact & CTA */}
            <Section className="px-[40px] pb-[40px]">
              <Row>
                <Column className="w-[60%] pr-[20px]">
                  <Heading className="text-[#1F2937] text-[18px] font-bold mb-[20px] m-0">Contact Information</Heading>

                  <div className="mb-[12px]">
                    <Text className="text-[#1F2937] text-[14px] m-0">
                      📍 <strong>Accra Office</strong> — Accra, Ghana
                    </Text>
                  </div>

                  <div className="mb-[12px]">
                    <Text className="text-[#1F2937] text-[14px] m-0">
                      📞{" "}
                      <Link href="tel:+233209334967" className="text-[#7C3AED] no-underline">
                        +233 20 933 4967
                      </Link>
                    </Text>
                  </div>

                  <div>
                    <Text className="text-[#1F2937] text-[14px] m-0">
                      ✉{" "}
                      <Link href="mailto:vheeworld@gmail.com" className="text-[#7C3AED] no-underline">
                        vheeworld@gmail.com
                      </Link>
                    </Text>
                  </div>
                </Column>

                <Column className="w-[40%] pl-[20px]">
                  <Button
                    href={`mailto:${email}`}
                    className="box-border bg-[#7C3AED] text-white text-[14px] font-semibold px-[24px] py-[12px] rounded-[24px] no-underline text-center block w-full"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)",
                    }}>
                    Reply to Applicant →
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Footer */}
            <Section className="px-[40px] pb-[32px] border-t border-gray-200">
              <Text className="text-[#6B7280] text-[12px] text-center leading-[1.5] mt-[24px] m-0">
                This application was submitted from the Vhee World volunteer form.
                <br />
                Visit us at{" "}
                <Link href="https://vhee-world.vercel.app" className="text-[#7C3AED] no-underline">
                  https://vhee-world.vercel.app
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
