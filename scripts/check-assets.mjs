// Verifies that every local public asset referenced in source code actually
// exists in /public. Catches renamed or deleted images before they 404.
// Usage: node scripts/check-assets.mjs   (exit 1 if anything is missing)
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, extname } from "node:path"

const ROOT = join(import.meta.dirname, "..")
const PUBLIC_DIR = join(ROOT, "public")
const SOURCE_DIRS = ["app", "components", "data", "lib"]
const SOURCE_EXTS = new Set([".ts", ".tsx", ".css", ".mjs"])

// Local public paths as they appear in string literals, e.g. "/images/x.jpg".
const ASSET_PATTERN = /["'`](\/(?:images\/[^"'`\s?#]+\.(?:jpe?g|png|webp|svg|gif|avif)|[^"'`\s/?#]+\.(?:png|svg|pdf|ico|webp)))["'`]/g

function* sourceFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      yield* sourceFiles(full)
    } else if (SOURCE_EXTS.has(extname(entry))) {
      yield full
    }
  }
}

const missing = []
let referenced = 0

for (const dir of SOURCE_DIRS) {
  const abs = join(ROOT, dir)
  if (!existsSync(abs)) continue
  for (const file of sourceFiles(abs)) {
    const src = readFileSync(file, "utf8")
    for (const match of src.matchAll(ASSET_PATTERN)) {
      const assetPath = match[1]
      referenced++
      if (!existsSync(join(PUBLIC_DIR, assetPath))) {
        missing.push({ assetPath, file: file.slice(ROOT.length + 1) })
      }
    }
  }
}

if (missing.length > 0) {
  console.error(`✖ ${missing.length} referenced asset(s) missing from /public:\n`)
  for (const { assetPath, file } of missing) {
    console.error(`  ${assetPath}\n    referenced in ${file}`)
  }
  process.exit(1)
}

console.log(`✓ All ${referenced} referenced public assets exist.`)
