"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const navLinks = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Projects", id: "projects" },
  { name: "Reviews", id: "reviews" },
  { name: "Contact", id: "contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll-spy: highlight the section currently in view (homepage only)
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null)
      return
    }

    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  const handleNavClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(false)
    router.push(`/#${sectionId}`)
  }

  const resumeUrl = "/MichaelLoRusso_RESUME.pdf"

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        "bg-secondary/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-secondary/65",
        "border-b border-border/40",
        "before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/40 before:to-transparent",
        scrolled ? "shadow-md shadow-primary/5" : "",
      )}
    >
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          LO RUSSO
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={(e) => handleNavClick(link.id, e)}
              aria-current={activeSection === link.id ? "true" : undefined}
              className={cn(
                "px-4 py-2 rounded-full hover:bg-primary/10 transition-all duration-300 cursor-pointer font-medium",
                activeSection === link.id
                  ? "text-primary bg-primary/10"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              {link.name}
            </button>
          ))}

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full hover:bg-primary/10 transition-all duration-300"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button
              className="rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              asChild
            >
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="rounded-full"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-navigation"
        className={cn(
          "md:hidden bg-background/95 backdrop-blur-lg border-b border-border/50 overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
          {navLinks.map((link, index) => (
            <button
              key={link.name}
              onClick={(e) => handleNavClick(link.id, e)}
              aria-current={activeSection === link.id ? "true" : undefined}
              className={cn(
                "py-3 px-4 rounded-lg hover:bg-primary/10 transition-all duration-200 transform text-left font-medium",
                activeSection === link.id
                  ? "text-primary bg-primary/10"
                  : "text-foreground/80 hover:text-foreground",
                isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.name}
            </button>
          ))}
          <Button
            className={cn(
              "w-full rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 transform mt-4",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
            style={{ transitionDelay: "200ms" }}
            asChild
          >
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              Resume
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
