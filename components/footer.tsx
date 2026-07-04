"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"
import { EMAIL, GITHUB_URL, LINKEDIN_URL, SITE_NAME } from "@/lib/site"

export default function Footer() {
  return (
    <footer className="bg-muted/30 py-8">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex justify-center space-x-1 mb-4">
            <a
              href={`mailto:${EMAIL}`}
              className="p-3 text-foreground/50 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-foreground/50 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-foreground/50 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          <p className="text-foreground/40 text-xs">© {new Date().getFullYear()} {SITE_NAME}</p>
        </motion.div>
      </div>
    </footer>
  )
}
