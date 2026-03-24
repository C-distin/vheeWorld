"use client"

import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { dancingScript, platypi } from "@/components/fonts"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Image src="/logo.png" alt="Vhee World logo" width={52} height={52} priority />

              <span className={`text-blue-500 ${platypi.className}`}>Vhee</span>

              <span className={`text-purple-500 ${dancingScript.className}`}>World</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              VheeWorld Foundation works to fight streetism by providing shelter, education, and opportunities for
              vulnerable children.
            </p>

            <Link href="/get-involved/donate">
              <Button className="mt-2 bg-purple-500 hover:bg-purple-600">Support the Mission</Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-purple-500 transition">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/projects" className="hover:text-purple-500 transition">
                  Our Projects
                </Link>
              </li>

              <li>
                <Link href="/get-involved" className="hover:text-purple-500 transition">
                  Get Involved
                </Link>
              </li>

              <li>
                <Link href="/blog" className="hover:text-purple-500 transition">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-purple-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <IconMapPin size={16} />
                Accra, Ghana
              </li>

              <li className="flex items-center gap-2">
                <IconPhone size={16} />
                +233 20 933 4967
              </li>

              <li className="flex items-center gap-2">
                <IconMail size={16} />
                vheeworld@gmail.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VheeWorld Foundation. All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-4">
            <Link href="#">
              <IconBrandFacebook className="hover:text-purple-500 transition" />
            </Link>

            <Link href="#">
              <IconBrandInstagram className="hover:text-purple-500 transition" />
            </Link>

            <Link href="#">
              <IconBrandX className="hover:text-purple-500 transition" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
