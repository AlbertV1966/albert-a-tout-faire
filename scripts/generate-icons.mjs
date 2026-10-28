// Génération des icônes du site (onglet, Google, écran d'accueil) dans public/.
// Script de préparation, hors build Vite (il n'est importé nulle part).
//
// Usage :
//   node scripts/generate-icons.mjs
//
// Source unique : public/favicon.svg. Pour les fichiers matriciels, le fond
// vert bouteille couvre tout le carré (coins arrondis retirés) : Google, iOS
// et Android appliquent leur propre masque et un coin transparent ferait un
// liseré. Jusqu'à 48 px, le trait du « A » passe de 5 à 6 unités pour rester
// lisible à 16 px. Sans withMetadata(), sharp n'écrit aucune métadonnée.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url))
const SMALL_MAX = 48

const PNG_FILES = [
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-512x512.png', size: 512 },
]

const ICO_SIZES = [16, 32, 48]

const source = await readFile(`${PUBLIC_DIR}favicon.svg`, 'utf8')
const square = source.replace(/(<rect\b[^>]*?) rx="[^"]*"/, '$1')
if (square === source) {
  throw new Error('favicon.svg : attribut rx du fond introuvable, vérifier le fichier')
}
const squareSmall = square.replaceAll('stroke-width="5"', 'stroke-width="6"')

/** PNG carré de `size` px, rendu directement à la bonne taille. */
async function renderPng(size) {
  const svg = size <= SMALL_MAX ? squareSmall : square
  // viewBox de 64 unités : densité calculée pour un rendu net, sans agrandir
  const png = await sharp(Buffer.from(svg), { density: (72 * size) / 64 })
    .resize(size, size)
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toBuffer()
  return stripPngChunks(png)
}

/**
 * Ne garde que les blocs indispensables du PNG (IHDR, IDAT, IEND).
 * libvips ajoute toujours un bloc pHYs (résolution), qu'on retire ici.
 */
function stripPngChunks(png) {
  const KEEP = new Set(['IHDR', 'IDAT', 'IEND'])
  const parts = [png.subarray(0, 8)]
  let position = 8
  while (position < png.length) {
    const length = png.readUInt32BE(position)
    const type = png.toString('ascii', position + 4, position + 8)
    const end = position + 12 + length
    if (KEEP.has(type)) parts.push(png.subarray(position, end))
    position = end
  }
  return Buffer.concat(parts)
}

/** Fichier ICO contenant des images PNG (format accepté depuis Windows Vista). */
function buildIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  let offset = 6 + 16 * images.length
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(24, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)])
}

for (const { name, size } of PNG_FILES) {
  const data = await renderPng(size)
  await writeFile(`${PUBLIC_DIR}${name}`, data)
  console.log(`${name}: ${size}x${size}, ${data.length} octets`)
}

const icoImages = []
for (const size of ICO_SIZES) {
  icoImages.push({ size, data: await renderPng(size) })
}
const ico = buildIco(icoImages)
await writeFile(`${PUBLIC_DIR}favicon.ico`, ico)
console.log(`favicon.ico: ${ICO_SIZES.join(', ')} px, ${ico.length} octets`)
