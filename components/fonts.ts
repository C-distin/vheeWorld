import { Dancing_Script, Inter, Platypi } from "next/font/google"

export const inter = Inter({
  weight: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const platypi = Platypi({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-platypi",
  display: "swap",
})

export const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
})
