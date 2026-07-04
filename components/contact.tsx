"use client"

import { useRef, useState } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Mail, MapPin, Linkedin, Github, Copy, Check } from "lucide-react"
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/site"

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — the mailto link still works
    }
  }

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
              <div className="flex items-center gap-3 text-foreground/70">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${EMAIL}?subject=Portfolio%20enquiry`}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {EMAIL}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email address copied" : "Copy email address"}
                  className="ml-auto inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-primary transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 text-foreground/60">
                <MapPin className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-sm">Sydney, Australia</span>
              </div>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-sm">LinkedIn</span>
              </a>

              <a
                href={GITHUB_URL}
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
