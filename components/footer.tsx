"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"

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
              href="mailto:lorussom28@gmail.com"
              className="p-3 text-foreground/50 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/michael-lo-russo/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-foreground/50 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/m-lorusso"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-foreground/50 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          <p className="text-foreground/40 text-xs">© 2026 Michael Lo Russo</p>
        </motion.div>
      </div>
    </footer>
  )
}
