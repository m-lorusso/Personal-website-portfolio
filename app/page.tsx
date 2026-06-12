import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Michael Lo Russo",
  url: siteUrl,
  jobTitle: "Mechatronics Engineering Student",
  affiliation: { "@type": "CollegeOrUniversity", name: "UNSW Sydney" },
  address: { "@type": "PostalAddress", addressLocality: "Sydney", addressCountry: "AU" },
  email: "mailto:lorussom28@gmail.com",
  sameAs: ["https://www.linkedin.com/in/michael-lo-russo/", "https://github.com/m-lorusso"],
}

export default function Home() {
  return (
    <main className="min-h-dvh bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <section id="home">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </main>
  )
}
