// Compresses source images in /public/images without visible quality loss:
//  - JPEG: auto-orient, cap longest side at 1920px (next/image never serves
//    wider — see deviceSizes in next.config.mjs), re-encode at quality 85
//    with mozjpeg.
//  - PNG: same size cap, lossless recompression only (no palette
//    quantization, so screenshots and gradients stay pixel-clean).
//  - A file is only replaced when the result is at least 5% smaller.
// Originals remain recoverable from git history.
// Usage: node scripts/compress-images.mjs
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { join, extname } from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const sharp = require("sharp")

const ROOT = join(import.meta.dirname, "..")
const IMAGES_DIR = join(ROOT, "public", "images")
const MAX_DIMENSION = 1920
const MIN_SAVING = 0.05

function* imageFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      yield* imageFiles(full)
    } else if ([".jpg", ".jpeg", ".png"].includes(extname(entry).toLowerCase())) {
      yield full
    }
  }
}

let totalBefore = 0
let totalAfter = 0
let replaced = 0
let kept = 0

for (const file of imageFiles(IMAGES_DIR)) {
  const original = readFileSync(file)
  const isPng = extname(file).toLowerCase() === ".png"

  // .rotate() with no args applies the EXIF orientation before it is
  // stripped, so photos keep their correct rotation.
  let pipeline = sharp(original)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })

  pipeline = isPng
    ? pipeline.png({ compressionLevel: 9 })
    : pipeline.jpeg({ quality: 85, mozjpeg: true })

  const output = await pipeline.toBuffer()
  totalBefore += original.length

  if (output.length < original.length * (1 - MIN_SAVING)) {
    writeFileSync(file, output)
    totalAfter += output.length
    replaced++
  } else {
    totalAfter += original.length
    kept++
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1)
console.log(`Rewrote ${replaced} file(s), kept ${kept} already-efficient file(s).`)
console.log(`Total: ${mb(totalBefore)} MB -> ${mb(totalAfter)} MB`)
