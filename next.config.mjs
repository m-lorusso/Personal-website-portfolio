/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // Image optimization — let Next.js serve WebP/AVIF and resize on demand
  images: {
    formats: ['image/avif', 'image/webp'],
    // Thumbnail sizes used in galleries + full-width sizes for hero/slideshow
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // YouTube thumbnails for the click-to-load video facade
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com' }],
  },

  // Compression
  compress: true,
}

export default nextConfig
