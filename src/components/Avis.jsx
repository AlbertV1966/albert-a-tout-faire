import { useEffect, useRef, useState } from 'react'
import { ChevronDown, CircleAlert, CircleCheck, Star, StarHalf } from 'lucide-react'
import { WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT } from '../site.js'
import avis from '../data/avis.json'

/*
 * Les avis reçus par le formulaire arrivent par e-mail. Seuls ceux ajoutés à
 * la main dans src/data/avis.json sont affichés, après vérification.
 */

const ERROR_FALLBACK = 'L’envoi n’a pas abouti. Réessayez dans un instant.'
const COMMENT_MIN = 20
const COMMENT_MAX = 800
const NOTES = [1, 2, 3, 4, 5]

/** Date AAAA-MM-JJ lue comme une date locale, sans décalage de fuseau. */
function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatNote(value) {
  return value.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

/**
 * Cinq étoiles, arrondies à la demi-étoile (une moyenne de 4,5 en montre
 * quatre et demie). Décoratives : la note est écrite à côté.
 */
function Stars({ note, size = 18 }) {
  const rounded = Math.round(note * 2) / 2

  return (
    <span className="stars" aria-hidden="true">
      {NOTES.map((value) =>
        value - 0.5 === rounded ? (
          <span className="stars__half" key={value}>
            <Star size={size} strokeWidth={2} className="stars__star" />
            <StarHalf size={size} strokeWidth={2} className="stars__star stars__star--on" />
          </span>
        ) : (
          <Star
            key={value}
            size={size}
            strokeWidth={2}
            className={value <= rounded ? 'stars__star stars__star--on' : 'stars__star'}
          />
        ),
      )}
    </span>
  )
}

function AvisCard({ item }) {
  const auteur = item.initiale ? `${item.prenom} ${item.initiale}.` : item.prenom
  const details = [item.commune, item.travaux].filter(Boolean).join(', ')

  return (
    <li className="avis-card">
      <div className="avis-card__rating">
        <Stars note={item.note} />
        <span className="visually-hidden">Note : {item.note} sur 5</span>
      </div>
      <p className="avis-card__text">{item.commentaire}</p>
      <div className="avis-card__meta">
        <p className="avis-card__author">{auteur}</p>
        {details ? <p className="avis-card__details">{details}</p> : null}
        <p className="avis-card__date">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
        </p>
      </div>
    </li>
  )
}

function AvisForm({ onClose, firstFieldRef }) {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [note, setNote] = useState(0)
  const [hoverNote, setHoverNote] = useState(0)
  const [commentLength, setCommentLength] = useState(0)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget

    // minlength accepte un commentaire fait d'espaces : on compte sans eux
    const commentaire = form.elements.commentaire
    if (commentaire.value.trim().length < COMMENT_MIN) {
      commentaire.setCustomValidity(
        `Votre commentaire doit compter au moins ${COMMENT_MIN} caractères.`,
      )
      commentaire.reportValidity()
      return
    }

    setStatus('sending')
    setErrorMessage('')

    const payload = Object.fromEntries(new FormData(form).entries())
    payload.subject = `Nouvel avis client, ${payload.note}/5`

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => null)

      if (response.ok && result && result.success) {
        form.reset()
        setNote(0)
        setCommentLength(0)
        setStatus('success')
        return
      }

      setErrorMessage((result && result.message) || ERROR_FALLBACK)
      setStatus('error')
    } catch {
      setErrorMessage(ERROR_FALLBACK)
      setStatus('error')
    }
  }

  const shownNote = hoverNote || note

  return (
    <div className="form-block avis__form">
      <p className="visually-hidden" role="status" aria-live="polite">
        {status === 'sending' ? 'Envoi de votre avis en cours.' : ''}
        {status === 'success' ? 'Votre avis a bien été envoyé.' : ''}
        {status === 'error' ? 'Votre avis n’a pas pu être envoyé.' : ''}
      </p>

      {status === 'success' ? (
        <div className="form-success">
          <span className="form-success__mark" aria-hidden="true">
            <CircleCheck size={28} strokeWidth={2} />
          </span>
          <h3>Merci pour votre avis&nbsp;!</h3>
          <p>Il sera publié après vérification.</p>
          <button
            type="button"
            className="btn btn--quiet"
            onClick={() => {
              setStatus('idle')
              onClose()
            }}
          >
            Fermer
          </button>
        </div>
      ) : (
        <form action={WEB3FORMS_ENDPOINT} method="POST" onSubmit={handleSubmit}>
          <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
          <input type="hidden" name="from_name" value="Site Albert à tout faire" />

          {/* Piège à robots, invisible et ignoré par les personnes */}
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="avis-botcheck">Ne pas remplir ce champ</label>
            <input
              id="avis-botcheck"
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="field-grid field-grid--two">
            <div className="field">
              <label htmlFor="avis-prenom">Votre prénom</label>
              <input
                ref={firstFieldRef}
                id="avis-prenom"
                name="prenom"
                type="text"
                required
                autoComplete="given-name"
                placeholder="Marie"
              />
            </div>
            <div className="field">
              <label htmlFor="avis-initiale">
                Initiale de votre nom <span className="field__optional">(facultatif)</span>
              </label>
              <input
                id="avis-initiale"
                name="initiale"
                type="text"
                maxLength={1}
                autoCapitalize="characters"
                autoComplete="off"
                placeholder="D"
              />
            </div>
          </div>

          <div className="field-grid field-grid--two">
            <div className="field">
              <label htmlFor="avis-commune">
                Votre commune <span className="field__optional">(facultatif)</span>
              </label>
              <input
                id="avis-commune"
                name="commune"
                type="text"
                autoComplete="address-level2"
                placeholder="Templeuve"
              />
            </div>
            <div className="field">
              <label htmlFor="avis-travaux">
                Type de travaux <span className="field__optional">(facultatif)</span>
              </label>
              <input
                id="avis-travaux"
                name="travaux"
                type="text"
                autoComplete="off"
                placeholder="Peinture d’une chambre"
              />
            </div>
          </div>

          <fieldset className="rating">
            <legend>Votre note</legend>
            <div className="rating__stars" onMouseLeave={() => setHoverNote(0)}>
              {NOTES.map((value) => (
                <span className="rating__item" key={value}>
                  <input
                    className="rating__input"
                    id={`avis-note-${value}`}
                    type="radio"
                    name="note"
                    value={value}
                    required
                    checked={note === value}
                    onChange={() => setNote(value)}
                  />
                  <label
                    className="rating__label"
                    htmlFor={`avis-note-${value}`}
                    onMouseEnter={() => setHoverNote(value)}
                  >
                    <Star
                      size={32}
                      strokeWidth={2}
                      aria-hidden="true"
                      className={
                        value <= shownNote ? 'stars__star stars__star--on' : 'stars__star'
                      }
                    />
                    <span className="visually-hidden">
                      {value} {value === 1 ? 'étoile' : 'étoiles'} sur 5
                    </span>
                  </label>
                </span>
              ))}
              <span className="rating__value" aria-hidden="true">
                {shownNote ? `${shownNote} sur 5` : ''}
              </span>
            </div>
          </fieldset>

          <div className="field-grid">
            <div className="field">
              <label htmlFor="avis-commentaire">Votre commentaire</label>
              <textarea
                id="avis-commentaire"
                name="commentaire"
                required
                rows={5}
                minLength={COMMENT_MIN}
                maxLength={COMMENT_MAX}
                aria-describedby="avis-commentaire-aide"
                placeholder="Par exemple : Albert est venu le lendemain, travail propre et prix respecté."
                onInput={(event) => {
                  event.currentTarget.setCustomValidity('')
                  setCommentLength(event.currentTarget.value.length)
                }}
              />
              <p className="field__hint" id="avis-commentaire-aide">
                Entre {COMMENT_MIN} et {COMMENT_MAX} caractères ({commentLength}/{COMMENT_MAX})
              </p>
            </div>
          </div>

          <div className="consent">
            <input
              id="avis-consentement"
              type="checkbox"
              name="consentement"
              value="Oui"
              required
            />
            <label htmlFor="avis-consentement">
              J’accepte que mon avis soit publié sur ce site avec mon prénom et l’initiale de
              mon nom
            </label>
          </div>

          <button type="submit" className="btn btn--bottle" disabled={status === 'sending'}>
            {status === 'sending' ? 'Envoi en cours' : 'Envoyer mon avis'}
          </button>

          {status === 'error' ? (
            <p className="form-alert" role="alert">
              <CircleAlert size={18} strokeWidth={2} aria-hidden="true" />
              <span>{errorMessage}</span>
            </p>
          ) : null}
        </form>
      )}
    </div>
  )
}

export default function Avis() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const firstFieldRef = useRef(null)

  const sorted = [...avis].sort((a, b) => b.date.localeCompare(a.date))
  const count = sorted.length
  const average = count ? sorted.reduce((sum, item) => sum + item.note, 0) / count : 0

  // Le focus suit l'ouverture du formulaire
  useEffect(() => {
    if (open) firstFieldRef.current?.focus()
  }, [open])

  function close() {
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <section className="section section--mist" id="avis" aria-labelledby="avis-titre">
      <div className="container">
        <div className="section-head">
          <h2 className="title-section" id="avis-titre">
            Avis clients
          </h2>
        </div>

        <div className="avis__bar">
          {count ? (
            <p className="avis__summary">
              <span className="avis__average">{formatNote(average)}</span>
              <span className="avis__summary-detail">
                <Stars note={average} size={20} />
                <span>
                  <span className="visually-hidden">sur 5, </span>
                  {count} avis
                </span>
              </span>
            </p>
          ) : (
            <p className="lead avis__invite">
              Vous avez fait appel à Albert&nbsp;? Partagez votre expérience.
            </p>
          )}

          <button
            ref={toggleRef}
            type="button"
            className="btn btn--bottle avis__toggle"
            aria-expanded={open}
            aria-controls="avis-formulaire"
            onClick={() => setOpen((value) => !value)}
          >
            Laisser un avis
            <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div id="avis-formulaire" hidden={!open}>
          <AvisForm onClose={close} firstFieldRef={firstFieldRef} />
        </div>

        {count ? (
          <ul className="avis__list">
            {sorted.map((item, index) => (
              <AvisCard item={item} key={`${item.date}-${item.prenom}-${index}`} />
            ))}
          </ul>
        ) : null}

        <p className="avis__legal">
          Les avis sont recueillis via le formulaire de ce site. Ils sont vérifiés avant
          publication et affichés avec leur date de dépôt. Ne sont pas publiés les avis
          injurieux, hors sujet, ou ne correspondant pas à une prestation réalisée. Les avis
          ne font l’objet d’aucune contrepartie.
        </p>
      </div>
    </section>
  )
}
