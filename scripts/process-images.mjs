// Recadrage et export des photos d'Albert pour public/images/.
// Script de préparation, hors build Vite (il n'est importé nulle part).
//
// Usage :
//   node scripts/process-images.mjs <portrait.jpg> <chantier.jpg>
//
// Les zones de recadrage sont exprimées en pixels sur les fichiers d'origine
// (portrait 4201 x 6301, chantier 1080 x 1920). Sans withMetadata(), sharp
// n'écrit ni EXIF (GPS compris) ni XMP dans les fichiers produits.
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const OUT_DIR = fileURLToPath(new URL('../public/images/', import.meta.url))

const PHOTOS = [
  {
    name: 'albert-portrait',
    // Cadrage buste en 4:5 : visage dans le tiers supérieur, air au-dessus
    // de la tête, bras croisés entiers.
    crop: { left: 252, top: 945, width: 3780, height: 4725 },
    width: 1000,
  },
  {
    name: 'albert-chantier',
    // 2:3 resserré sur Albert et la table : sans les reflets du plafond
    // (rayons à droite compris), le pot de peinture, les chiffons ni les
    // cartons du bas. On garde le bas des poutres et les murs bleus.
    crop: { left: 0, top: 390, width: 760, height: 1140 },
    width: 760,
  },
]

async function processPhoto(source, { name, crop, width }) {
  const base = sharp(source)
    .rotate()
    .extract(crop)
    .resize({ width: Math.min(width, 1600), withoutEnlargement: true })
    .sharpen({ sigma: 0.6 })

  const webp = await base.clone().webp({ quality: 80 }).toFile(`${OUT_DIR}${name}.webp`)
  const jpg = await base
    .clone()
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(`${OUT_DIR}${name}.jpg`)

  console.log(
    `${name}: ${webp.width}x${webp.height}, webp ${Math.round(webp.size / 1024)} Ko, jpg ${Math.round(jpg.size / 1024)} Ko`,
  )
}

const sources = process.argv.slice(2)
if (sources.length !== PHOTOS.length) {
  console.error('Usage : node scripts/process-images.mjs <portrait.jpg> <chantier.jpg>')
  process.exit(1)
}

await mkdir(OUT_DIR, { recursive: true })
for (const [index, photo] of PHOTOS.entries()) {
  await processPhoto(sources[index], photo)
}
