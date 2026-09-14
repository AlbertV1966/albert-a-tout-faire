import { MapPin } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { COMMUNES } from '../site.js'

export default function Zone() {
  return (
    <section className="section section--cream" id="zone">
      <div className="container zone">
        <Reveal className="section-head">
          <span className="overline">Où j’interviens</span>
          <h2 className="title-lg">La Pévèle et la périphérie de Lille</h2>
          <p className="lead">
            Je suis basé en Pévèle et je me déplace dans toutes les communes alentour.
            Vous n’êtes pas certain d’être dans la zone ? Appelez, on vérifie
            en trente secondes.
          </p>
          <hr className="rule" />
        </Reveal>

        <Reveal className="zone__panel" delay={80}>
          <span className="zone__label">Communes desservies</span>
          <ul className="chips">
            {COMMUNES.map((commune) => (
              <li className="chip" key={commune}>
                <MapPin size={15} strokeWidth={1.5} aria-hidden="true" />
                {commune}
              </li>
            ))}
          </ul>
          <p className="zone__footnote">
            Vous habitez juste à côté ? Demandez quand même, je m’arrange le plus
            souvent.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
