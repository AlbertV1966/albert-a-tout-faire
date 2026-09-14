import { Check } from 'lucide-react'
import { PhoneReveal } from '../phone.jsx'

const POINTS = [
  'Devis gratuit, prix annoncé avant',
  'Réponse sous 48 h',
  'Chantier propre, matériel rangé',
]

export default function Hero() {
  return (
    <header className="hero on-dark" id="top">
      <div className="container hero__grid">
        <div>
          <span className="pill">Pévèle et Métropole de Lille</span>
          <h1 className="title-hero hero__title">
            Un bon artisan, <span className="accent-word">vraiment</span> à côté de chez
            vous.
          </h1>
          <p className="hero__lead">
            Électricité, plomberie, chauffage, peinture, petits travaux. Vous expliquez ce
            qu’il faut faire, Albert passe, et le travail est fait proprement.
          </p>

          <div className="btn-row">
            <a className="btn btn--accent" href="#contact">
              Demander un devis gratuit
            </a>
            <a className="btn btn--outline-light" href="#formations">
              Voir les formations
            </a>
          </div>
        </div>

        <div className="hero__card">
          <h2>Besoin d’un coup de main ?</h2>
          <PhoneReveal className="phone-reveal--large" iconSize={26} />
          <ul className="hero__points">
            {POINTS.map((point) => (
              <li key={point}>
                <Check size={18} strokeWidth={2} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
