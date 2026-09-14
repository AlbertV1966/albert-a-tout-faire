import { Plug, Droplets, Flame, PaintRoller, Hammer, Wrench } from 'lucide-react'

const SERVICES = [
  {
    icon: Plug,
    title: 'Électricité',
    text: 'Électricien en Pévèle pour vos prises, interrupteurs, luminaires et la remise en ordre du tableau.',
  },
  {
    icon: Droplets,
    title: 'Petite plomberie',
    text: 'Le plombier qu’on appelle à Templeuve ou à Cysoing : fuite, robinet qui goutte, siphon, joints de baignoire ou de douche.',
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
    <section className="section section--white" id="services" aria-labelledby="services-titre">
      <div className="container">
        <div className="section-head">
          <h2 className="title-section" id="services-titre">
            Ce qu’Albert fait chez vous
          </h2>
        </div>
        <p className="lead">
          Plombier de métier, électricien et peintre au fil des chantiers, Albert est
          l’artisan multiservices de la Pévèle et de la Métropole de Lille. Du dépannage
          d’une heure au chantier d’une journée.
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
