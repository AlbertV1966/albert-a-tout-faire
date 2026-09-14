import { Handshake, ShieldCheck, Ruler, Clock } from 'lucide-react'
import Reveal from './Reveal.jsx'

/**
 * Emplacement optionnel pour une photo d'Albert.
 * Déposez le fichier dans le dossier public puis remplacez null par son chemin,
 * par exemple '/albert.jpg'. Sans photo, le cadre laiton affiche le monogramme.
 */
const PHOTO = null
const PHOTO_ALT = 'Albert, artisan multiservices en Pévèle'

const REASONS = [
  {
    icon: Handshake,
    title: 'Artisan de proximité',
    text: 'Je vis et je travaille en Pévèle. Un seul interlocuteur, joignable, qui connaît la région.',
  },
  {
    icon: ShieldCheck,
    title: 'Devis gratuit',
    text: 'Je me déplace, je regarde, je vous annonce un prix clair avant de commencer.',
  },
  {
    icon: Ruler,
    title: 'Travail soigné',
    text: 'Je prends le temps de bien faire et je repars en laissant la pièce propre.',
  },
  {
    icon: Clock,
    title: 'Interventions rapides',
    text: 'Un imprévu ? Un appel suffit, je m’organise pour passer au plus vite.',
  },
]

export default function WhyAlbert() {
  return (
    <section className="section section--green on-dark" id="pourquoi">
      <div className="container why">
        <div>
          <Reveal className="section-head">
            <span className="overline">Pourquoi Albert</span>
            <h2 className="title-lg">Un artisan que vous appelez par son prénom</h2>
            <p className="lead">
              Pas de standard téléphonique, pas de devis qui gonfle en cours de route.
              Juste quelqu’un qui fait le travail comme il le ferait chez lui.
            </p>
          </Reveal>

          <ul className="why__list">
            {REASONS.map((reason, index) => {
              const Icon = reason.icon
              return (
                <Reveal
                  as="li"
                  className="why__item"
                  key={reason.title}
                  delay={index * 60}
                >
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.text}</p>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>

        <Reveal delay={120}>
          <figure className="portrait">
            <div className="portrait__inner">
              {PHOTO ? (
                <img src={PHOTO} alt={PHOTO_ALT} width="640" height="800" loading="lazy" />
              ) : (
                <span className="portrait__monogram" aria-hidden="true">
                  A
                </span>
              )}
            </div>
            <figcaption className="portrait__caption">
              Albert, artisan en Pévèle
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
