// Single source of truth for site-wide contact details, links, and the
// canonical URL. Update values here — never inline them in components.

export const SITE_NAME = "Michael Lo Russo"
export const EMAIL = "lorussom28@gmail.com"
export const RESUME_URL = "/MichaelLoRusso_RESUME.pdf"
export const GITHUB_URL = "https://github.com/m-lorusso"
export const LINKEDIN_URL = "https://www.linkedin.com/in/michael-lo-russo/"

/**
 * Canonical site origin: explicit env override, then the Vercel production
 * domain, then localhost for dev builds.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  return "http://localhost:3000"
}
