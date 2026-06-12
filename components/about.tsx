"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"

export default function About() {
  const ref = useRef(null)
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeImage, setActiveImage] = useState<"personal" | "samsung" | "store">("personal")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const images = ["personal", "samsung", "store"] as const
  const currentIndex = images.indexOf(activeImage)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleImageChange = useCallback(
    (newImage: "personal" | "samsung" | "store") => {
      if (isTransitioning || newImage === activeImage) return

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)

      setIsTransitioning(true)
      setActiveImage(newImage)

      // Reset transition lock after animation completes
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false)
      }, 500) // Slightly longer than the 0.4s animation
    },
    [activeImage, isTransitioning],
  )

  // Clear pending transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    }
  }, [])

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (isTransitioning) return

      const newIndex =
        direction === "left" ? (currentIndex + 1) % images.length : (currentIndex - 1 + images.length) % images.length

      handleImageChange(images[newIndex])
    },
    [currentIndex, handleImageChange, isTransitioning],
  )

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">About Me</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-16 h-1 bg-primary mx-auto origin-center"
          />
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative w-full lg:max-w-lg mx-auto lg:mx-0 mt-8"
          >
            {/* Card deck container */}
            <motion.div
              className="relative w-full h-[400px] sm:h-96 md:h-[450px] lg:h-[500px]"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const threshold = 50
                if (info.offset.x > threshold) {
                  handleSwipe("right")
                } else if (info.offset.x < -threshold) {
                  handleSwipe("left")
                }
              }}
            >
              {/* Personal photo card */}
              <motion.div
                className="absolute inset-0 cursor-pointer"
                style={{
                  zIndex: activeImage === "personal" ? 30 : activeImage === "samsung" ? 15 : 10,
                }}
                animate={{
                  x: activeImage === "personal" ? 0 : activeImage === "samsung" ? (isMobile ? -6 : -30) : (isMobile ? -12 : -60),
                  y: activeImage === "personal" ? 0 : activeImage === "samsung" ? (isMobile ? -4 : -15) : (isMobile ? -6 : -30),
                  rotate: activeImage === "personal" ? 0 : activeImage === "samsung" ? -4 : -8,
                  scale: activeImage === "personal" ? 1 : 0.95,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onMouseEnter={() => handleImageChange("personal")}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg border-4 border-white shadow-xl">
                  <Image
                    src="/images/personal/melbourne.jpg"
                    alt="Michael Lo Russo at Melbourne waterfront sunset"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>

              {/* Samsung office photo card */}
              <motion.div
                className="absolute inset-0 cursor-pointer"
                style={{
                  zIndex:
                    activeImage === "samsung"
                      ? 30
                      : activeImage === "personal"
                        ? 25
                        : activeImage === "store"
                          ? 15
                          : 20,
                }}
                animate={{
                  x: activeImage === "samsung" ? 0 : activeImage === "personal" ? (isMobile ? 6 : 30) : (isMobile ? -6 : -30),
                  y: activeImage === "samsung" ? 0 : activeImage === "personal" ? (isMobile ? 4 : 15) : (isMobile ? -4 : -15),
                  rotate: activeImage === "samsung" ? 0 : activeImage === "personal" ? 4 : -4,
                  scale: activeImage === "samsung" ? 1 : 0.95,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onMouseEnter={() => handleImageChange("samsung")}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg border-4 border-white shadow-xl">
                  <Image
                    src="/images/personal/samsung.png"
                    alt="Michael Lo Russo at Samsung Office"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
              </motion.div>

              {/* Samsung Store photo card */}
              <motion.div
                className="absolute inset-0 cursor-pointer"
                style={{
                  zIndex: activeImage === "store" ? 30 : activeImage === "samsung" ? 25 : 10,
                }}
                animate={{
                  x: activeImage === "store" ? 0 : activeImage === "samsung" ? (isMobile ? 6 : 30) : (isMobile ? 12 : 60),
                  y: activeImage === "store" ? 0 : activeImage === "samsung" ? (isMobile ? 4 : 15) : (isMobile ? 6 : 30),
                  rotate: activeImage === "store" ? 0 : activeImage === "samsung" ? 4 : 6,
                  scale: activeImage === "store" ? 1 : 0.95,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onMouseEnter={() => handleImageChange("store")}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg border-4 border-white shadow-xl">
                  <Image
                    src="/images/personal/samsung-store.jpg"
                    alt="Michael Lo Russo at Samsung Store"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Mobile navigation dots */}
            <div className="mt-3 flex justify-center md:hidden">
              {images.map((image) => (
                <button
                  key={image}
                  onClick={() => handleImageChange(image)}
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label={`View ${image} photo`}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                      activeImage === image ? "bg-primary" : "bg-primary/30"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Instructions - responsive text */}
            <p className="mt-1 md:mt-10 text-center text-foreground/60 text-sm">
              <span className="hidden md:inline">Hover over photos to bring them forward</span>
              <span className="md:hidden">Swipe left or right to browse photos</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <h3 className="text-xl font-bold">Who I Am</h3>
            <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
              {"I'm a final-year Mechatronics Engineering student at UNSW. I like to build things, and once that included an entire house with my father. That project taught me how to manage real deadlines, coordinate tradespeople, and back myself on problems I'd never solved before."}
            </p>
            <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
              Before engineering I played semi-professional football, which gave me the discipline and team mindset I bring to every project. I currently work at Samsung, which has sharpened my ability to work with people and solve problems quickly.
            </p>
            <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
              Outside of work I hit the gym, go for runs, play video games, and relax with family.
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-5 pt-4">
              {/* C++ Logo */}
              <div className="flex w-20 flex-col items-center gap-1.5">
                <div className="bg-background rounded-lg p-3 shadow-sm flex items-center justify-center w-16 h-16 hover-lift">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#00599C" aria-hidden="true">
                    <path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.109c-3.92 0-7.109-3.189-7.109-7.109S8.08 4.891 12 4.891a7.133 7.133 0 016.156 3.552l-3.076 1.781A3.567 3.567 0 0012 8.445c-1.96 0-3.554 1.595-3.554 3.555S10.04 15.555 12 15.555a3.57 3.57 0 003.08-1.778l3.077 1.8A7.135 7.135 0 0112 19.109zm7.109-6.714h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79v.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79v.79z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-foreground/60">C++</span>
              </div>

              {/* MATLAB Logo */}
              <div className="flex w-20 flex-col items-center gap-1.5">
                <div className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 hover-lift">
                  <img
                    src="/images/logos/matlab.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                    loading="lazy"
                    style={{ maxWidth: '40px', maxHeight: '40px', width: 'auto', height: 'auto' }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground/60">MATLAB</span>
              </div>

              {/* SolidWorks Logo */}
              <div className="flex w-20 flex-col items-center gap-1.5">
                <div className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 hover-lift">
                  <img
                    src="/images/logos/solidworks.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                    loading="lazy"
                    style={{ maxWidth: '40px', maxHeight: '40px', width: 'auto', height: 'auto' }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground/60">SolidWorks</span>
              </div>

              {/* Fusion 360 Logo */}
              <div className="flex w-20 flex-col items-center gap-1.5">
                <div className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 hover-lift">
                  <img
                    src="/images/logos/fusion360.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                    loading="lazy"
                    style={{ maxWidth: '40px', maxHeight: '40px', width: 'auto', height: 'auto' }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground/60">Fusion 360</span>
              </div>

              {/* Bambu Lab Logo */}
              <div className="flex w-20 flex-col items-center gap-1.5">
                <div className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 hover-lift">
                  <img
                    src="/images/logos/bambu-lab.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                    loading="lazy"
                    style={{ maxWidth: '40px', maxHeight: '40px', width: 'auto', height: 'auto' }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground/60">Bambu Lab</span>
              </div>

              {/* VS Code Logo */}
              <div className="flex w-20 flex-col items-center gap-1.5">
                <div className="bg-background rounded-lg p-3 shadow-sm flex items-center justify-center w-16 h-16 hover-lift">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#007ACC" aria-hidden="true">
                    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-foreground/60">VS Code</span>
              </div>

              {/* Python Logo */}
              <div className="flex w-20 flex-col items-center gap-1.5">
                <div className="bg-background rounded-lg p-3 shadow-sm flex items-center justify-center w-16 h-16 hover-lift">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" aria-hidden="true">
                    <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.887S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.031v-2.868s-.109-3.403 3.347-3.403h5.77s3.24.052 3.24-3.13V3.13S18.316 0 11.914 0zm-3.21 1.814a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z" fill="#3776AB"/>
                    <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.134S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.031v2.868s.109 3.403-3.347 3.403h-5.77s-3.24-.052-3.24 3.13v5.401S5.684 24 12.086 24zm3.21-1.814a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1z" fill="#FFD43B"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-foreground/60">Python</span>
              </div>

              {/* Git Logo */}
              <div className="flex w-20 flex-col items-center gap-1.5">
                <div className="bg-background rounded-lg p-3 shadow-sm flex items-center justify-center w-16 h-16 hover-lift">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#F05032" aria-hidden="true">
                    <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.634-2.531l-2.48-2.48v6.511a1.838 1.838 0 0 1 .488 3.635 1.838 1.838 0 0 1-2.327-1.76 1.838 1.838 0 0 1 1-1.634V9.186a1.838 1.838 0 0 1-1-1.634 1.838 1.838 0 0 1 .05-.45L8.197 4.42 .454 12.163a1.55 1.55 0 0 0 0 2.187l10.48 10.48a1.55 1.55 0 0 0 2.187 0l10.424-10.424a1.55 1.55 0 0 0 0-2.187" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-foreground/60">Git</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
