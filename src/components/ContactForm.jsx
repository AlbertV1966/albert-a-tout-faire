import { useState } from 'react'
import { Phone, CircleCheck, CircleAlert } from 'lucide-react'
import Reveal from './Reveal.jsx'
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  WEB3FORMS_ACCESS_KEY,
  WEB3FORMS_ENDPOINT,
} from '../site.js'

const ERROR_FALLBACK =
  'L’envoi n’a pas abouti. Réessayez dans un instant ou appelez directement le ' +
  PHONE_DISPLAY +
  '.'

export default function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    setErrorMessage('')

    const payload = Object.fromEntries(new FormData(form).entries())

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

  return (
    <section className="section section--cream" id="contact">
      <div className="container contact">
        <Reveal className="contact__aside">
          <div className="section-head">
            <span className="overline">Demander un devis</span>
            <h2 className="title-lg">Racontez votre projet</h2>
            <p className="lead">
              Décrivez en quelques mots ce dont vous avez besoin. Je vous rappelle
              rapidement pour convenir d’un passage et vous donner un prix.
            </p>
            <hr className="rule" />
          </div>
          <a className="contact__direct" href={PHONE_HREF}>
            <Phone size={19} strokeWidth={1.5} aria-hidden="true" />
            {PHONE_DISPLAY}
          </a>
        </Reveal>

        <Reveal className="form-card" delay={80}>
          <p className="visually-hidden" role="status" aria-live="polite">
            {status === 'sending' ? 'Envoi de votre demande en cours.' : ''}
            {status === 'success' ? 'Votre demande a bien été envoyée.' : ''}
            {status === 'error' ? 'Votre demande n’a pas pu être envoyée.' : ''}
          </p>

          {status === 'success' ? (
            <div className="form-success">
              <span className="form-success__mark" aria-hidden="true">
                <CircleCheck size={28} strokeWidth={1.5} />
              </span>
              <h3>Merci, votre demande est partie.</h3>
              <p>
                Je vous rappelle très vite au numéro que vous avez laissé. À bientôt.
              </p>
              <button
                type="button"
                className="btn btn--quiet"
                onClick={() => setStatus('idle')}
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <form
              action={WEB3FORMS_ENDPOINT}
              method="POST"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
              <input
                type="hidden"
                name="subject"
                value="Nouvelle demande de devis, site Albert à tout faire"
              />
              <input type="hidden" name="from_name" value="Site Albert à tout faire" />

              {/* Piège à robots, invisible et ignoré par les personnes */}
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="botcheck">Ne pas remplir ce champ</label>
                <input
                  id="botcheck"
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="field-grid field-grid--two">
                <div className="field">
                  <label htmlFor="nom">Votre nom</label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Marie Dubois"
                  />
                </div>
                <div className="field">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="field-grid">
                <div className="field">
                  <label htmlFor="commune">Commune</label>
                  <input
                    id="commune"
                    name="commune"
                    type="text"
                    required
                    autoComplete="address-level2"
                    placeholder="Templeuve"
                  />
                </div>
                <div className="field">
                  <label htmlFor="besoin">Votre besoin</label>
                  <textarea
                    id="besoin"
                    name="besoin"
                    required
                    rows={5}
                    placeholder="Par exemple : remplacer deux prises et poser une étagère dans le salon."
                  />
                </div>
              </div>

              <button type="submit" className="btn btn--brass" disabled={status === 'sending'}>
                {status === 'sending' ? 'Envoi en cours' : 'Envoyer ma demande'}
              </button>

              <p className="form-note">
                Vos informations servent uniquement à vous recontacter. Aucun démarchage,
                aucune revente.
              </p>

              {status === 'error' ? (
                <p className="form-alert" role="alert">
                  <CircleAlert size={18} strokeWidth={1.5} aria-hidden="true" />
                  <span>{errorMessage}</span>
                </p>
              ) : null}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
