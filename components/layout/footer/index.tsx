"use client"

import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconMail,
  IconMapPin,
  IconPhone,
  IconArrowNarrowRight,
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { dancingScript, platypi } from "@/components/fonts"

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Projects", href: "/projects" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

const socials = [
  { icon: IconBrandFacebook, href: "#", label: "Facebook" },
  { icon: IconBrandInstagram, href: "#", label: "Instagram" },
  { icon: IconBrandX, href: "#", label: "X" },
]

export function Footer() {
  return (
    <footer className="relative bg-[#080d1f] overflow-hidden">
      {/* Atmospheric top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)" }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* CTA Banner */}
      {/* <div className="relative border-b border-white/[0.06]"> */}
      {/*   <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"> */}
      {/*     <div className="space-y-1"> */}
      {/*       <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-400/70">Make a difference</p> */}
      {/*       <h3 className="text-2xl md:text-3xl font-black text-white leading-tight"> */}
      {/*         Streetism should not <br className="hidden md:block" /> be an option. */}
      {/*       </h3> */}
      {/*     </div> */}
      {/*     <Link */}
      {/*       href="/get-involved/donate" */}
      {/*       className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-widest uppercase text-gray-900 hover:scale-[1.03] active:scale-[0.98] transition-transform flex-shrink-0" */}
      {/*       style={{ background: "linear-gradient(90deg, #facc15, #fb923c)" }}> */}
      {/*       Support the Mission */}
      {/*       <IconArrowNarrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" /> */}
      {/*     </Link> */}
      {/*   </div> */}
      {/* </div> */}

      {/* Main footer grid */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Vhee World logo" width={48} height={48} priority />
              <div className="text-xl font-semibold">
                <span className={`text-blue-400 tracking-tight ${platypi.className}`}>Vhee</span>
                <span className={`text-purple-400 tracking-tight ${dancingScript.className}`}>World</span>
              </div>
            </Link>

            <p className="text-sm text-white/40 leading-relaxed max-w-sm">
              A registered NGO committed to eradicating streetism and empowering vulnerable children in Ghana through
              education, mentorship, and mental health support.
            </p>

            {/* Contact inline */}
            <ul className="space-y-2.5">
              {[
                { icon: IconMapPin, text: "Accra, Ghana" },
                { icon: IconPhone, text: "+233 20 933 4967" },
                { icon: IconMail, text: "vheeworld@gmail.com" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-xs text-white/35">
                  <Icon size={13} className="text-purple-400/60 flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/40 hover:border-purple-500/50 hover:text-purple-400 transition-all duration-200">
                  <Icon size={15} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/25">Navigate</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-sm text-white/45 hover:text-white transition-colors duration-200">
                    <span className="block w-0 h-px bg-purple-400 group-hover:w-4 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Areas */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/25">Focus Areas</h4>
            <ul className="space-y-3">
              {["Education", "Mentorship", "Mental Health", "Resource Provision", "Community Outreach"].map((item) => (
                <li key={item} className="text-sm text-white/45">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20 tracking-wide">
            © {new Date().getFullYear()} VheeWorld Foundation. All rights reserved.
          </p>
          <p className="text-[11px] text-white/15 italic tracking-wide">"Streetism should not be an option."</p>
        </div>
      </div>
    </footer>
  )
}
