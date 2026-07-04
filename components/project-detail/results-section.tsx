// Renders a project's `results` prose (from projects-data.ts) as a titled
// section, splitting on blank lines into paragraphs. Layouts pass their own
// container classes so the section matches each page's visual idiom.
export function ResultsSection({
  results,
  heading = "What came out of it",
  className = "rounded-lg border bg-muted/10 p-5 md:p-7",
}: {
  results?: string
  heading?: string
  className?: string
}) {
  if (!results) return null

  const paragraphs = results
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <section className={className}>
      <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Results</div>
      <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
      <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-foreground/70 md:text-base">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}
