import { Plug, Droplets, Flame, Hammer, PaintRoller, Package, Wrench } from 'lucide-react'
import Reveal from './Reveal.jsx'

const SERVICES = [
  {
    icon: Plug,
    title: 'Électricité',
    text: 'Prises, interrupteurs, luminaires, remise en ordre du tableau.',
  },
  {
    icon: Droplets,
    title: 'Petite plomberie',
    text: 'Fuite, robinet qui goutte, siphon, joints de baignoire ou de douche.',
  },
  {
    icon: Flame,
    title: 'Petit chauffage',
    text: 'Purge de radiateurs, thermostat, réglages pour retrouver le confort.',
  },
  {
    icon: Hammer,
    title: 'Petits travaux',
    text: 'Étagères, fixations, poignées, portes qui grincent, réparations du quotidien.',
  },
  {
    icon: PaintRoller,
    title: 'Peinture',
    text: 'Murs, plafonds et boiseries, finitions nettes et pièce rendue propre.',
  },
  {
    icon: Package,
    title: 'Montage de meubles',
    text: 'Cuisine, dressing, bibliothèque, je monte et je fixe au millimètre.',
  },
]

export default function Services() {
  return (
    <section className="section section--cream" id="services">
      <div className="container">
        <Reveal className="section-head">
          <span className="overline">Ce que je fais</span>
          <h2 className="title-lg">Des travaux bien faits, sans mauvaise surprise</h2>
          <p className="lead">
            De la petite réparation au chantier d’une journée, je m’occupe de ce
            qui traîne depuis trop longtemps chez vous.
          </p>
          <hr className="rule" />
        </Reveal>

        <div className="card-grid">
          {SERVICES.map((service, index) => {
            const Icon = service.icon
            return (
              <Reveal
                as="article"
                className="card"
                key={service.title}
                delay={Math.min(index, 5) * 60}
              >
                <Icon className="card__icon" size={26} strokeWidth={1.5} aria-hidden="true" />
                <h3 className="title-sm card__title">{service.title}</h3>
                <p className="card__text">{service.text}</p>
              </Reveal>
            )
          })}

          <Reveal as="article" className="card card--wide" delay={360}>
            <Wrench className="card__icon" size={26} strokeWidth={1.5} aria-hidden="true" />
            <div className="card__body">
              <h3 className="title-sm card__title">Autres travaux sur demande</h3>
              <p className="card__text">
                Un besoin qui ne rentre dans aucune case ? Expliquez ce que vous avez en
                tête, on trouve la bonne solution ensemble.
              </p>
            </div>
            <a className="card__link" href="#contact">
              En parler avec Albert
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
