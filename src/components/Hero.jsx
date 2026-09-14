import { Phone, Check } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { PHONE_DISPLAY, PHONE_HREF } from '../site.js'

export default function Hero() {
  return (
    <div className="hero on-dark">
      <div className="hero__pattern" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#top">
            <span className="brand__mark" aria-hidden="true">
              A
            </span>
            <span className="brand__name">Albert à tout faire</span>
          </a>
          <a
            className="header-phone"
            href={PHONE_HREF}
            aria-label={`Appeler Albert au ${PHONE_DISPLAY}`}
          >
            <Phone size={17} strokeWidth={1.5} aria-hidden="true" />
            <span className="header-phone__label">{PHONE_DISPLAY}</span>
          </a>
        </div>
      </header>

      <div className="container">
        <Reveal className="hero__body">
          <span className="overline">
            Artisan multiservices, Pévèle et périphérie lilloise
          </span>
          <h1 className="title-xl">Albert à tout faire</h1>
          <p className="lead">
            Un artisan de confiance pour les petits travaux de la maison. Vous
            m’appelez, je passe voir, je vous dis franchement ce qu’il y a à
            faire et ce que cela coûte.
          </p>

          <div className="btn-row">
            <a className="btn btn--brass" href="#contact">
              Demander un devis
            </a>
            <a className="btn btn--outline" href={PHONE_HREF}>
              <Phone size={18} strokeWidth={1.5} aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
          </div>

          <p className="hero__note">
            <Check size={16} strokeWidth={1.5} aria-hidden="true" />
            Devis gratuit, réponse rapide, chantier laissé propre.
          </p>
        </Reveal>
      </div>
    </div>
  )
}
