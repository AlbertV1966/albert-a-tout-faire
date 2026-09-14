import { Plug, Droplets, Flame, PaintRoller, Hammer, Wrench } from 'lucide-react'

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
    icon: PaintRoller,
    title: 'Peinture',
    text: 'Murs, plafonds et boiseries, finitions nettes et pièce rendue propre.',
  },
  {
    icon: Hammer,
    title: 'Petits travaux',
    text: 'Étagères, fixations, poignées, portes qui grincent, réparations du quotidien.',
  },
  {
    icon: Wrench,
    title: 'Autre besoin',
    text: 'Votre demande ne rentre dans aucune case ? Expliquez, on trouve une solution.',
  },
]

export default function Services() {
  return (
    <section className="section section--white" id="services">
      <div className="container">
        <div className="section-head">
          <h2 className="title-section">Ce qu’Albert fait chez vous</h2>
        </div>
        <p className="lead">
          Du dépannage d’une heure au chantier d’une journée, Albert s’occupe de ce qui
          traîne depuis trop longtemps.
        </p>

        <ul className="service-list">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <li className="service-row" key={service.title}>
                <Icon
                  className="service-row__icon"
                  size={24}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <h3 className="title-item service-row__title">{service.title}</h3>
                <p className="service-row__text">{service.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
