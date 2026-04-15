"use client"

import { IconMenu, IconX } from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { dancingScript, platypi } from "@/components/fonts"
import { Button } from "@/components/ui/button"

interface NavLinkProps {
  id: number
  name: string
  href: string
}

const navLinks: NavLinkProps[] = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "About", href: "/about" },
  { id: 3, name: "Get Involved", href: "/get-involved" },
  { id: 4, name: "Projects", href: "/projects" },
  { id: 5, name: "Blog", href: "/blog" },
  { id: 6, name: "Contact", href: "/contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto"
  }, [isOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Header wrapper */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4">
        <motion.div
          animate={{
            width: isScrolled ? "92%" : "100%",
            y: isScrolled ? 10 : 0,
          }}
          transition={{ duration: 0.25 }}
          className={`flex items-center justify-between h-16 max-w-7xl w-full px-6 transition-all duration-300 ${
            isScrolled ? "bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl" : "bg-transparent"
          }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://2qh3exphzw.ufs.sh/f/2ZIw3S0QKedpwvVGtabI0aCoDfLcHhZi8y5Tg1Yues2EO3d7"
              alt="Vhee World logo"
              width={52}
              height={52}
              priority
            />
            <div className="text-xl font-semibold">
              <span className={`text-blue-500 tracking-tight ${platypi.className}`}>Vhee</span>
              <span className={`text-purple-500 tracking-tight ${dancingScript.className}`}>World</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-widest text-gray-700 hover:text-blue-500 transition relative group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/get-involved/donate" className="hidden md:block">
              <Button
                variant="outline"
                className="px-5 border-black rounded h-9 font-semibold uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all duration-300 hover:border-purple-500">
                Donate
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="lg:hidden">
              {isOpen ? <IconX size={22} /> : <IconMenu size={22} />}
            </Button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.nav
              initial={{ opacity: 0, x: "100%" }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                  staggerChildren: 0.06,
                  delayChildren: 0.1,
                },
              }}
              exit={{
                opacity: 0,
                x: "100%",
                transition: { type: "spring", stiffness: 400, damping: 40 },
              }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="text-lg font-semibold">
                    <span className={`text-blue-500 ${platypi.className}`}>Vhee</span>
                    <span className={`text-purple-500 ${dancingScript.className}`}>World</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeMenu}>
                    <IconX size={22} />
                  </Button>
                </div>

                <div className="flex flex-col gap-2 p-6">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}>
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="block py-3 px-4 text-lg rounded-lg hover:bg-gray-50">
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 mt-auto">
                  <Link href="/get-involved/donate">
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">Donate</Button>
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
