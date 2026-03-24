import type { Metadata } from "next"
import { inter } from "@/components/fonts"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import "./globals.css"

const title = "Vhee World"
const description =
  "The VheeWorld platform is built to support humanitarian work aimed at reducing streetism and uplifting vulnerable communities. Through technology, the platform connects donors, volunteers, and beneficiaries, enabling coordinated outreach, education programs, and mental health support initiatives."

export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vheeworld.org",
    title: title,
    description: description,
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    site: "https://vheeworld.org",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth`}>
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
