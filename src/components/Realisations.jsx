import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import realisations from '../data/realisations.json'

/*
 * Réalisations : une carte par chantier, lue dans src/data/realisations.json
 * (produit par npm run photos). Vignettes 600 px dans les cartes, version
 * 1600 px à l'agrandissement. Tant que le fichier est vide, la section et son
 * lien dans le menu ne s'affichent pas.
 */

/** Vrai quand au moins un chantier a des photos : la section et le lien du menu s'affichent. */
export const HAS_REALISATIONS = realisations.some((r) =>
  ['avant', 'apres', 'chantier'].some((c) => (r.photos?.[c] || []).length > 0),
)

const LABELS = { avant: 'Avant', apres: 'Après', chantier: 'Photo du chantier' }

/** Toutes les photos d'un chantier, dans l'ordre avant, après, chantier, avec leur texte alternatif. */
function photosOf(realisation) {
  const sujet = `${realisation.travaux} à ${realisation.commune}`
  const list = []
  for (const categorie of ['avant', 'apres', 'chantier']) {
    const photos = realisation.photos?.[categorie] || []
    photos.forEach((photo, index) => {
      const rang = photos.length > 1 ? ` (${index + 1} sur ${photos.length})` : ''
      list.push({
        ...photo,
        categorie,
        label: LABELS[categorie],
        alt: `${LABELS[categorie]}, ${sujet}${rang}`,
      })
    })
  }
  return list
}

/** Photos montrées dans la carte : avant et après côte à côte s'il y a les deux, sinon les photos du chantier. */
function cardPhotos(all) {
  const avant = all.find((p) => p.categorie === 'avant')
  const apres = all.find((p) => p.categorie === 'apres')
  if (avant && apres) return [avant, apres]
  const chantier = all.filter((p) => p.categorie === 'chantier')
  return (chantier.length ? chantier : all).slice(0, 2)
}

/** « 2026-09-14 » -> « septembre 2026 », lu comme une date locale. */
function formatMois(value) {
  if (!value) return ''
  const [year, month] = value.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

function Lightbox({ photos, index, onIndex, onClose }) {
  const dialogRef = useRef(null)
  const photo = photos[index]
  const many = photos.length > 1

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const step = useCallback(
    (delta) => onIndex((index + delta + photos.length) % photos.length),
    [index, photos.length, onIndex],
  )

  function handleKeyDown(event) {
    if (!many) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    }
  }

  return (
    // Échap ferme la boîte de dialogue native (événement close) ; un clic sur le fond aussi.
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={photo.alt}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close()
      }}
    >
      <div className="lightbox__inner">
        <button
          type="button"
          className="lightbox__close"
          onClick={() => dialogRef.current.close()}
          aria-label="Fermer l’agrandissement"
          autoFocus
        >
          <X size={22} strokeWidth={2} aria-hidden="true" />
        </button>

        <figure className="lightbox__figure">
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.largeur}
            height={photo.hauteur}
            decoding="async"
          />
          <figcaption className="lightbox__caption">
            {photo.alt}
            {many ? (
              <span className="lightbox__count">
                {index + 1} / {photos.length}
              </span>
            ) : null}
          </figcaption>
        </figure>

        {many ? (
          <div className="lightbox__nav">
            <button type="button" className="lightbox__arrow" onClick={() => step(-1)}>
              <ChevronLeft size={22} strokeWidth={2} aria-hidden="true" />
              <span>Photo précédente</span>
            </button>
            <button type="button" className="lightbox__arrow" onClick={() => step(1)}>
              <span>Photo suivante</span>
              <ChevronRight size={22} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </dialog>
  )
}

function RealisationCard({ realisation, onOpen }) {
  const all = photosOf(realisation)
  const shown = cardPhotos(all)
  const autres = all.length - shown.length
  const mois = formatMois(realisation.date)

  return (
    <li className="realisation-card">
      <div className={`realisation-card__photos realisation-card__photos--${shown.length}`}>
        {shown.map((photo) => (
          <button
            type="button"
            className="realisation-card__photo"
            key={photo.src}
            onClick={(event) => onOpen(all, all.indexOf(photo), event.currentTarget)}
          >
            <img
              src={photo.vignette}
              alt={photo.alt}
              width={photo.largeur}
              height={photo.hauteur}
              loading="lazy"
              decoding="async"
            />
            {photo.categorie !== 'chantier' ? (
              <span className="realisation-card__tag" aria-hidden="true">
                {photo.label}
              </span>
            ) : null}
            <span className="visually-hidden">, agrandir la photo</span>
          </button>
        ))}
      </div>
      <div className="realisation-card__body">
        <h3 className="title-item">{realisation.titre}</h3>
        <p className="realisation-card__meta">
          {realisation.commune}
          {mois ? (
            <>
              {' · '}
              <time dateTime={realisation.date}>{mois}</time>
            </>
          ) : null}
        </p>
        {autres > 0 ? (
          <button
            type="button"
            className="realisation-card__more"
            onClick={(event) => onOpen(all, 0, event.currentTarget)}
          >
            Voir les {all.length} photos
          </button>
        ) : null}
      </div>
    </li>
  )
}

export default function Realisations() {
  const [viewer, setViewer] = useState(null) // { photos, index }
  const triggerRef = useRef(null)

  if (!HAS_REALISATIONS) return null

  const chantiers = realisations.filter((r) => photosOf(r).length > 0)

  function open(photos, index, trigger) {
    triggerRef.current = trigger
    setViewer({ photos, index })
  }

  function close() {
    setViewer(null)
    // Le focus revient sur la photo ou le bouton qui a ouvert l'agrandissement.
    triggerRef.current?.focus()
  }

  return (
    <section
      className="section section--white"
      id="realisations"
      aria-labelledby="realisations-titre"
    >
      <div className="container">
        <div className="section-head">
          <span className="pill">Chantiers récents</span>
          <h2 className="title-section" id="realisations-titre">
            Réalisations
          </h2>
          <p className="lead">
            Quelques chantiers menés en Pévèle et dans la Métropole de Lille, avant et après
            le passage d’Albert.
          </p>
        </div>

        <ul className="realisations__list">
          {chantiers.map((realisation) => (
            <RealisationCard realisation={realisation} key={realisation.slug} onOpen={open} />
          ))}
        </ul>
      </div>

      {viewer ? (
        <Lightbox
          photos={viewer.photos}
          index={viewer.index}
          onIndex={(index) => setViewer((v) => ({ ...v, index }))}
          onClose={close}
        />
      ) : null}
    </section>
  )
}
