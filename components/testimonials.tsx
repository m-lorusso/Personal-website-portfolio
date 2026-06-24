"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

// Canonical Google Maps link to the Samsung Experience Store Parramatta, by its
// unique place CID — opens the exact store listing directly (not a search), so
// visitors land on the real reviews.
const STORE_REVIEWS_URL = "https://www.google.com/maps?cid=1727041227478455918"

type Review = {
  quote: string
  author: string
  date: string
  rating?: number // out of 5, defaults to 5
  url?: string // link to the specific Google review (or the store listing)
}

const reviews: Review[] = [
  {
    quote:
      "Michael was fantastic today. He provided excellent service. He was very professional and knowledgeable and spent the time to explain all the features of our new phone. He ensured everything was working well.",
    author: "Esther Hanbury",
    date: "Dec 2025",
    url: "https://share.google/K9Unk9kfQftykd6cN",
  },
  {
    quote:
      "I recently had an outstanding experience at the Samsung Store in Parramatta, thanks to Michael, the sales assistant. Michael's deep knowledge of Samsung products was evident, and his friendly demeanor made it easy for me to ask all my questions. I didn't hesitate to buy Galaxy Z Fold6. He was patient and went above and beyond by assisting with the data transfer from my old phone to the new one. I highly recommend both Michael and this store to anyone interested in purchasing Samsung products.",
    author: "Jiyoung Park",
    date: "Jun 2025",
    url: "https://share.google/txXn6yO944O1AazV1",
  },
  {
    quote:
      "Top notch customer service. Michael helped me with my flip 7's issue, was super professional and went over and above and beyond to fix it. Store and staff were lovely.",
    author: "elaina Hg",
    date: "Dec 2025",
    url: "https://share.google/s3IWt1Ft18sfTZEtG",
  },
]

// The four-colour Google "G" mark.
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  )
}

// Google-style initial avatar colours, picked deterministically from the name.
const AVATAR_COLORS = ["#1a73e8", "#188038", "#a142f4", "#e52592", "#f29900", "#d93025", "#12b5cb"]
function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function StarRating({ rating = 5, size = 18 }: { rating?: number; size?: number }) {
  return (
    <div className="flex" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i < rating ? "fill-[#fbbc04] text-[#fbbc04]" : "fill-foreground/15 text-foreground/15"}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function ReviewCard({ review, index, isInView }: { review: Review; index: number; isInView: boolean }) {
  const color = avatarColor(review.author)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
        {/* Header: avatar (with Google badge) + name */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-medium text-white"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            >
              {review.author.charAt(0).toUpperCase()}
            </span>
            {/* Signature Google "G" badge on the avatar */}
            <span className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white shadow ring-2 ring-card">
              <GoogleG className="h-2.5 w-2.5" />
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{review.author}</p>
            <p className="text-xs text-foreground/50">Reviewed on Google</p>
          </div>
        </div>

        {/* Stars + time */}
        <div className="mt-3 flex items-center gap-2">
          <StarRating rating={review.rating} size={16} />
          <span className="text-xs text-foreground/50">{review.date}</span>
        </div>

        {/* Review text */}
        <p className="mt-2.5 flex-grow text-sm leading-relaxed text-foreground/80">{review.quote}</p>

        {/* Footer: link to the real review */}
        {review.url && (
          <a
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read ${review.author}'s review on Google`}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#1a73e8] hover:underline dark:text-[#8ab4f8]"
          >
            <GoogleG className="h-3.5 w-3.5" />
            Read full review on Google
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">What Customers Say</h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mb-5 h-1 w-16 origin-center bg-primary"
          />

          <p className="mx-auto text-sm text-foreground/70 md:whitespace-nowrap md:text-base">
            Reviews from customers I helped at the Samsung Experience Store, Westfield Parramatta.
          </p>

          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/45">
            <GoogleG className="h-3.5 w-3.5" />
            Verified on Google
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} index={index} isInView={isInView} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <a href={STORE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              <GoogleG className="h-4 w-4" />
              See all reviews on Google
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
