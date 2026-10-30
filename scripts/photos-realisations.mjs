// Traitement des photos de chantiers pour les réalisations du site.
// Script de préparation, hors build Vite (il n'est importé nulle part).
//
// Usage (Windows, PowerShell, macOS, Linux) :
//   npm run photos
//
// Entrée : photos-a-traiter/, un sous-dossier par chantier nommé
// « Commune, travaux » (ex. « Templeuve, peinture d'une chambre »). Une photo
// dont le nom contient « avant » ou « apres » (« après ») est classée comme
// telle, les autres comme photos du chantier.
//
// Pour chaque photo : orientation appliquée, conversion en WebP qualité 80,
// une version 1600 px maxi et une vignette 600 px. Sans withMetadata(), sharp
// n'écrit AUCUNE métadonnée (EXIF, GPS compris, XMP, IPTC) : les adresses des
// clients ne sortent jamais. Nom de sortie : slug du nom d'origine + empreinte
// courte du contenu, donc la même photo donne toujours le même fichier.
//
// Sortie : public/images/realisations/<chantier>/ et src/data/realisations.json
// (titre, commune, travaux, date, photos ; du plus récent au plus ancien). Les
// originaux traités sont déplacés dans photos-traitees/<dossier du chantier>/.
// Ces deux dossiers d'originaux sont ignorés par git.
//
// Idempotent : relancer le script ne crée aucun doublon (fichiers déjà produits
// conservés, photos fusionnées par chemin dans le JSON).
import { createHash } from 'node:crypto'
import { copyFile, mkdir, readdir, readFile, rename, rm, stat, unlink, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const INPUT_DIR = path.join(ROOT, 'photos-a-traiter')
const DONE_DIR = path.join(ROOT, 'photos-traitees')
const OUTPUT_DIR = path.join(ROOT, 'public', 'images', 'realisations')
const JSON_FILE = path.join(ROOT, 'src', 'data', 'realisations.json')
// Chemin public des images (servies depuis public/ à la racine du site).
const PUBLIC_PREFIX = '/images/realisations'

const QUALITY = 80
const LARGE = 1600
const THUMB = 600
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.heic', '.heif', '.avif'])
const CATEGORIES = ['avant', 'apres', 'chantier']

/** « Pont-à-Marcq, Peinture d'une chambre » -> « pont-a-marcq-peinture-d-une-chambre » */
export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[œŒ]/g, 'oe')
    .replace(/[æÆ]/g, 'ae')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Catégorie d'une photo d'après son nom : avant, apres ou chantier. */
export function categorie(fileName) {
  const words = slugify(path.parse(fileName).name).split('-')
  if (words.includes('avant')) return 'avant'
  if (words.includes('apres')) return 'apres'
  return 'chantier'
}

/** « Commune, travaux » -> { commune, travaux } ; null si le nom ne suit pas le format. */
export function parseDossier(name) {
  const i = name.indexOf(',')
  if (i < 0) return null
  const commune = name.slice(0, i).trim()
  const travaux = name.slice(i + 1).trim()
  if (!commune || !travaux) return null
  return { commune, travaux }
}

function titre(commune, travaux) {
  return `${travaux.charAt(0).toUpperCase()}${travaux.slice(1)} à ${commune}`
}

// Date de prise de vue lue dans l'EXIF brut (avant qu'il soit retiré) : la plus
// ancienne date « AAAA:MM:JJ HH:MM:SS » trouvée, sinon null.
function datePriseDeVue(exif) {
  if (!exif) return null
  const dates = [...exif.toString('latin1').matchAll(/(\d{4}):(\d{2}):(\d{2}) \d{2}:\d{2}:\d{2}/g)]
    .map((m) => `${m[1]}-${m[2]}-${m[3]}`)
    .filter((d) => d >= '1990-01-01' && d <= '2100-01-01')
    .sort()
  return dates[0] || null
}

async function moveFile(from, to) {
  try {
    await rename(from, to)
  } catch {
    // Autre volume, ou fichier verrouillé un instant sous Windows : copie puis suppression.
    await copyFile(from, to)
    await unlink(from)
  }
}

// Déplace l'original dans photos-traitees/<dossier>/ sans jamais écraser un
// autre fichier ; un original identique déjà rangé est simplement retiré.
async function archiveOriginal(source, dossier, hash) {
  const destDir = path.join(DONE_DIR, dossier)
  await mkdir(destDir, { recursive: true })
  const { name, ext } = path.parse(source)
  let dest = path.join(destDir, `${name}${ext}`)
  for (let n = 2; existsSync(dest); n++) {
    const existing = createHash('sha1').update(await readFile(dest)).digest('hex').slice(0, 10)
    if (existing === hash) {
      await unlink(source)
      return dest
    }
    dest = path.join(destDir, `${name}-${n}${ext}`)
  }
  await moveFile(source, dest)
  return dest
}

async function loadJson() {
  if (!existsSync(JSON_FILE)) return []
  const data = JSON.parse(await readFile(JSON_FILE, 'utf8'))
  return Array.isArray(data) ? data : []
}

function sortRealisations(list) {
  for (const r of list) {
    for (const c of CATEGORIES) r.photos[c].sort((a, b) => a.src.localeCompare(b.src))
  }
  return list.sort((a, b) => b.date.localeCompare(a.date) || a.titre.localeCompare(b.titre, 'fr'))
}

async function processPhoto(file, slugChantier) {
  const buffer = await readFile(file)
  const hash = createHash('sha1').update(buffer).digest('hex').slice(0, 10)
  const base = `${slugify(path.parse(file).name) || 'photo'}-${hash.slice(0, 8)}`
  const outDir = path.join(OUTPUT_DIR, slugChantier)
  await mkdir(outDir, { recursive: true })
  const largePath = path.join(outDir, `${base}.webp`)
  const thumbPath = path.join(outDir, `${base}-600.webp`)

  const meta = await sharp(buffer).metadata()
  const dateExif = datePriseDeVue(meta.exif)
  const dateFichier = (await stat(file)).mtime.toISOString().slice(0, 10)

  // rotate() applique l'orientation EXIF ; aucune métadonnée n'est recopiée.
  const pipeline = sharp(buffer, { failOn: 'none' }).rotate()
  const large = existsSync(largePath)
    ? await sharp(largePath).metadata()
    : await pipeline
        .clone()
        .resize({ width: LARGE, height: LARGE, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(largePath)
  if (!existsSync(thumbPath)) {
    await pipeline
      .clone()
      .resize({ width: THUMB, height: THUMB, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(thumbPath)
  }
  return {
    hash,
    dateExif,
    dateFichier,
    categorie: categorie(file),
    photo: {
      src: `${PUBLIC_PREFIX}/${slugChantier}/${base}.webp`,
      vignette: `${PUBLIC_PREFIX}/${slugChantier}/${base}-600.webp`,
      largeur: large.width,
      hauteur: large.height,
    },
  }
}

async function main() {
  await mkdir(INPUT_DIR, { recursive: true })
  const realisations = await loadJson()
  const bySlug = new Map(realisations.map((r) => [r.slug, r]))
  const dossiers = (await readdir(INPUT_DIR, { withFileTypes: true })).filter((d) => d.isDirectory())
  let traitees = 0
  let erreurs = 0

  if (dossiers.length === 0) {
    console.log('Aucun chantier dans photos-a-traiter/. Rien à faire.')
  }

  for (const dossier of dossiers) {
    const info = parseDossier(dossier.name)
    if (!info) {
      console.error(`✗ Dossier ignoré « ${dossier.name} » : le nom doit être « Commune, travaux ».`)
      erreurs++
      continue
    }
    const slug = slugify(`${info.commune} ${info.travaux}`)
    let entry = bySlug.get(slug)
    if (!entry) {
      entry = {
        slug,
        titre: titre(info.commune, info.travaux),
        commune: info.commune,
        travaux: info.travaux,
        date: '',
        photos: { avant: [], apres: [], chantier: [] },
      }
      bySlug.set(slug, entry)
      realisations.push(entry)
    }

    const dir = path.join(INPUT_DIR, dossier.name)
    const files = (await readdir(dir, { withFileTypes: true }))
      .filter((f) => f.isFile() && EXTENSIONS.has(path.extname(f.name).toLowerCase()))
      .map((f) => path.join(dir, f.name))
      .sort()
    // Date du chantier : la prise de vue la plus récente (EXIF) ; la date des
    // fichiers ne sert que si aucune photo n'a de date de prise de vue.
    const datesExif = []
    const datesFichier = []
    for (const file of files) {
      try {
        const res = await processPhoto(file, slug)
        const list = entry.photos[res.categorie]
        if (!CATEGORIES.some((c) => entry.photos[c].some((p) => p.src === res.photo.src))) list.push(res.photo)
        if (res.dateExif) datesExif.push(res.dateExif)
        datesFichier.push(res.dateFichier)
        await archiveOriginal(file, dossier.name, res.hash)
        traitees++
        console.log(`✓ ${dossier.name} / ${path.basename(file)} -> ${res.categorie}, ${res.photo.largeur}x${res.photo.hauteur}`)
      } catch (err) {
        erreurs++
        console.error(`✗ ${dossier.name} / ${path.basename(file)} : ${err.message} (laissée dans photos-a-traiter)`)
      }
    }
    const dateExif = datesExif.sort().at(-1)
    if (dateExif && (!entry.date || dateExif > entry.date)) entry.date = dateExif
    else if (!entry.date && datesFichier.length) entry.date = datesFichier.sort().at(-1)
    // Dossier de chantier vidé : on le retire de photos-a-traiter.
    if ((await readdir(dir)).length === 0) await rm(dir, { recursive: true })
  }

  const kept = realisations.filter((r) => CATEGORIES.some((c) => r.photos[c].length > 0))
  await mkdir(path.dirname(JSON_FILE), { recursive: true })
  await writeFile(JSON_FILE, `${JSON.stringify(sortRealisations(kept), null, 2)}\n`, 'utf8')
  console.log(`${traitees} photo(s) traitée(s), ${kept.length} chantier(s) dans src/data/realisations.json.`)
  if (erreurs) {
    console.error(`${erreurs} problème(s) : voir les lignes ✗ ci-dessus.`)
    process.exitCode = 1
  }
}

await main()
