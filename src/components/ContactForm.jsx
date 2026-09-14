import { useState } from 'react'
import { CircleCheck, CircleAlert } from 'lucide-react'
import { PhoneReveal } from '../phone.jsx'
import { WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT } from '../site.js'

/* Le numéro n'apparaît pas ici non plus, même dans un message d'erreur. */
const ERROR_FALLBACK =
  'L’envoi n’a pas abouti. Réessayez dans un instant, ou affichez le numéro pour appeler directement.'

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
    <section className="section section--white" id="contact">
      <div className="container split">
        <div className="contact__aside">
          <span className="pill">Devis gratuit</span>
          <h2 className="title-section">Dites-nous ce qu’il faut faire</h2>
          <p className="lead">
            Quelques mots suffisent. Albert vous rappelle sous 48 h pour convenir d’un
            passage et vous annoncer un prix, avant de commencer quoi que ce soit.
          </p>
          <div className="contact__phone">
            <PhoneReveal className="phone-reveal--inline" iconSize={19} />
          </div>
        </div>

        <div className="form-block">
          <p className="visually-hidden" role="status" aria-live="polite">
            {status === 'sending' ? 'Envoi de votre demande en cours.' : ''}
            {status === 'success' ? 'Votre demande a bien été envoyée.' : ''}
            {status === 'error' ? 'Votre demande n’a pas pu être envoyée.' : ''}
          </p>

          {status === 'success' ? (
            <div className="form-success">
              <span className="form-success__mark" aria-hidden="true">
                <CircleCheck size={28} strokeWidth={2} />
              </span>
              <h3>Votre demande est partie.</h3>
              <p>
                Albert vous rappelle très vite au numéro que vous avez laissé. À bientôt.
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
            <form action={WEB3FORMS_ENDPOINT} method="POST" onSubmit={handleSubmit}>
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
                  <label htmlFor="telephone">Votre téléphone</label>
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
                  <label htmlFor="commune">Votre commune</label>
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
                  <label htmlFor="besoin">Ce qu’il faut faire</label>
                  <textarea
                    id="besoin"
                    name="besoin"
                    required
                    rows={5}
                    placeholder="Par exemple : remplacer deux prises et poser une étagère dans le salon."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--bottle"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Envoi en cours' : 'Envoyer ma demande'}
              </button>

              <p className="form-note">
                Vos informations servent uniquement à vous recontacter. Aucun démarchage,
                aucune revente.
              </p>

              {status === 'error' ? (
                <p className="form-alert" role="alert">
                  <CircleAlert size={18} strokeWidth={2} aria-hidden="true" />
                  <span>{errorMessage}</span>
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
