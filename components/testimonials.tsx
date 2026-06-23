"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Star, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

// ─────────────────────────────────────────────────────────────────────────────
// TODO — REPLACE THESE PLACEHOLDERS WITH REAL REVIEWS.
// On the store's Google listing → Reviews → search "Michael", then paste the
// genuine quote, the reviewer's first name, and the date here. Keep `url`
// pointing at the real review (or the store) so each one is verifiable.
// Add or remove entries freely — the grid adapts.
// ─────────────────────────────────────────────────────────────────────────────
const reviews: Review[] = [
  {
    quote:
      "Michael was fantastic today. He provided excellent service. He was very professional and knowledgeable and spent the time to explain all the features of our new phone. He ensured everything was working well.",
    author: "Esther Hanbury",
    date: "Dec 2025",
    url: "https://share.google/s3IWt1Ft18sfTZEtG",
  },
  {
    quote:
      "I recently had an outstanding experience at the Samsung Store in Parramatta, thanks to Michael, the sales assistant. Michael's deep knowledge of Samsung products was evident, and his friendly demeanor made it easy for me to ask all my questions. I didn't hesitate to buy Galaxy Z Fold6. He was patient and went above and beyond by assisting with the data transfer from my old phone to the new one. I highly recommend both Michael and this store to anyone interested in purchasing Samsung products.",
    author: "Jiyoung Park",
    date: "Jun 2025",
    url: "https://share.google/K9Unk9kfQftykd6cN",
  },
  {
    quote:
      "Top notch customer service. Michael helped me with my flip 7's issue, was super professional and went over and above and beyond to fix it. Store and staff were lovely.",
    author: "elaina Hg",
    date: "Dec 2025",
    url: "https://share.google/txXn6yO944O1AazV1",
  },
]

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-foreground/20"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function ReviewCard({ review, index, isInView }: { review: Review; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="group relative h-full flex flex-col p-6 hover-lift has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
        <CardContent className="flex flex-col flex-grow p-0">
          <StarRating rating={review.rating} />
          <p className="mt-4 flex-grow text-sm leading-relaxed text-foreground/80">{review.quote}</p>
          <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
              aria-hidden="true"
            >
              {review.author.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-grow">
              <p className="truncate text-sm font-semibold">{review.author}</p>
              <p className="text-xs text-foreground/50">{review.date} · Google review</p>
            </div>
            {review.url && (
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read ${review.author}'s review on Google`}
                className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">What Customers Say</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-16 h-1 bg-primary mx-auto mb-4 origin-center"
          />
          <p className="mx-auto text-foreground/70 text-sm md:text-base md:whitespace-nowrap">
            Reviews from customers I helped at the Samsung Experience Store, Westfield Parramatta.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} index={index} isInView={isInView} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <a href={STORE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              Read more on Google
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
