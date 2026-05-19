"use client"

import { motion } from "framer-motion"
import { ArrowDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import WavyLines from "./wavy-lines"

export default function Hero() {
  const resumeUrl = "/MichaelLoRusso_RESUME.pdf"

  return (
    <section id="home" className="min-h-dvh flex items-center justify-center relative pt-20 pb-12 overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 z-10">
        {/* Profile Image - Made smaller */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            <div className="absolute inset-0 border-4 border-primary translate-x-4 translate-y-4 rounded-full"></div>
            <div className="relative w-full h-full overflow-hidden rounded-full border-4 border-white shadow-2xl">
              <Image
                src="/images/personal/profile.jpg"
                alt="Michael Lo Russo"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 256px, 320px"
              />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-1"
          >
            <span className="text-base md:text-lg font-medium text-foreground/60">Hi, I'm</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent"
          >
            Michael Lo Russo
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-xl mb-6"
          >
            <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
              Final year Mechatronics Engineering student at UNSW.<br />
              I like to build things.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button size="lg" className="px-6 py-5 text-base font-medium" asChild>
              <a href="#projects">View My Work</a>
            </Button>
            <Button size="lg" variant="outline" className="px-6 py-5 text-base font-medium" asChild>
              <a href={resumeUrl} download="MichaelLoRusso_RESUME.pdf" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Resume
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">
          <ArrowDown size={24} />
        </a>
      </div>

      {/* Wavy lines background */}
      <WavyLines />
    </section>
  )
}
