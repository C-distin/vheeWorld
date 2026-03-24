"use client"

import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-linear-to-br from-blue-600 via-purple-600 to-blue-700">
      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content Container with Inline Variants */}
      <motion.div
        className="relative z-10 container mx-auto px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.3,
            },
          },
        }}>
        {/* Badge - Updated UI with Glassmorphism */}
        <motion.span
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/20 shadow-lg">
          We focus on the children of the streets
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
          Giving Street Children a Future
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10">
          VheeWorld Foundation works to rescue, educate, and empower children living on the streets.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary Action: Donate */}
          <Button
            size="lg"
            className="bg-white text-purple-700 hover:bg-blue-50 px-8 py-6 text-lg font-bold rounded-full shadow-xl transition-transform hover:scale-105">
            Donate Now
          </Button>

          {/* Secondary Action: Volunteer */}
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg font-semibold rounded-full transition-transform hover:scale-105 backdrop-blur-sm">
            Volunteer
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black/10 to-transparent" />
    </section>
  )
}
