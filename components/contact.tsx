"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Mail, MapPin, Linkedin, Github } from "lucide-react"

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Contact</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-16 h-1 bg-primary mx-auto origin-center"
          />
        </div>

        <div ref={ref} className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="border rounded-xl p-8 bg-muted/20"
          >
            <h3 className="text-xl font-bold mb-6">{"Let's connect"}</h3>

            <div className="space-y-4">
              <a
                href="mailto:lorussom28@gmail.com"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-sm">lorussom28@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-foreground/60">
                <MapPin className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-sm">Sydney, Australia</span>
              </div>

              <a
                href="https://www.linkedin.com/in/michael-lo-russo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-sm">LinkedIn</span>
              </a>

              <a
                href="https://github.com/m-lorusso"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
