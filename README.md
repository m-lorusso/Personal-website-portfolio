# Michael Lo Russo — Engineering Portfolio

Personal portfolio showcasing engineering projects — design, prototyping, embedded systems, and hands-on builds.

**Live site:** deployed on Vercel.

## Features

- **Project showcase** — homepage cards with outcome highlights, plus detailed per-project pages with image galleries, videos, and interactive 3D scenes
- **Responsive design** — optimized for mobile through desktop
- **Dark/light mode** — theme switching with system preference detection
- **Performance** — static generation, optimized images, and Vercel analytics

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **3D**: Three.js (project detail scenes)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

This project uses [pnpm](https://pnpm.io) (pinned via `packageManager` in package.json).

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run the development server: `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/          # Next.js app router pages, metadata, sitemap
├── components/   # React components (sections, project-detail, ui)
├── data/         # Project content (projects-data.ts)
├── lib/          # Utility functions
└── public/       # Images, resume, favicons
```

## Contact

- Email: lorussom28@gmail.com
- LinkedIn: [michael-lo-russo](https://www.linkedin.com/in/michael-lo-russo/)
- Location: Sydney, Australia
