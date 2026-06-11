import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-background flex items-center justify-center px-6 pt-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">404</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold">Page not found</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-foreground/60 md:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#projects">View projects</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
