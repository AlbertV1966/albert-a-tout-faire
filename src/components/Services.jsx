import { Toolbox, Drill, LifeBuoy, PaintRoller, Hammer, Store, Wrench } from 'lucide-react'

const SERVICES = [
  {
    icon: Toolbox,
    title: 'Petites réparations',
    text: 'Petites réparations dans la maison en Pévèle : ce qui est abîmé, décroché ou mal fixé, remis en état proprement.',
  },
  {
    icon: Drill,
    title: 'Petit bricolage',
    text: 'L’artisan qu’on appelle à Templeuve ou à Cysoing pour le petit bricolage : montage de meubles, joints de baignoire ou de douche, menus travaux.',
  },
  {
    icon: LifeBuoy,
    title: 'Dépannage',
    text: 'Un souci à régler vite ? Albert passe dans la semaine pour un dépannage du quotidien.',
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
    icon: Store,
    title: 'Protection de vitrines pour commerçants',
    text: 'Panneaux bois ou OSB posés sur rails, intervention rapide sur Lille et la métropole, dépose comprise sur demande.',
  },
  {
    icon: Wrench,
    title: 'Autre besoin',
    text: 'Votre demande ne rentre dans aucune case ? Expliquez, on trouve une solution.',
  },
]

/** Types de prestation proposés dans le formulaire de contact, alignés sur les services. */
export const PRESTATIONS = SERVICES.map((service) => service.title)

export default function Services() {
  return (
    <section className="section section--white" id="services" aria-labelledby="services-titre">
      <div className="container services-layout">
        <div className="services-layout__intro">
          <div className="section-head">
            <h2 className="title-section" id="services-titre">
              Ce qu’Albert fait chez vous
            </h2>
          </div>
          <p className="lead">
            Petites réparations, petit bricolage et peinture : Albert est
            l’artisan multiservices de la Pévèle et de la Métropole de Lille. Du dépannage
            d’une heure au chantier d’une journée.
          </p>
        </div>

        <figure className="photo photo--chantier services-layout__media">
          <picture>
            <source srcSet="/images/albert-chantier.webp" type="image/webp" />
            <img
              src="/images/albert-chantier.jpg"
              width="760"
              height="1140"
              loading="lazy"
              decoding="async"
              alt="Albert en chantier, montage de mobilier"
            />
          </picture>
        </figure>

        <ul className="service-list services-layout__list">
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
