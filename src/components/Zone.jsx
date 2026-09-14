import { COMMUNES_METROPOLE, COMMUNES_PEVELE } from '../site.js'

export default function Zone() {
  return (
    <section className="section section--mist" id="zone" aria-labelledby="zone-titre">
      <div className="container">
        <div className="section-head">
          <h2 className="title-section" id="zone-titre">
            La Pévèle et toute la Métropole de Lille
          </h2>
        </div>
        <p className="lead">
          Plombier, électricien et peintre, Albert intervient dans toute la Pévèle et la
          Métropole de Lille, de Templeuve à Lille. Votre commune n’est pas dans la
          liste ? Demandez quand même.
        </p>

        <ul className="chips">
          {COMMUNES_PEVELE.map((commune) => (
            <li className="chip chip--primary" key={commune}>
              {commune}
            </li>
          ))}
          {COMMUNES_METROPOLE.map((commune) => (
            <li className="chip" key={commune}>
              {commune}
            </li>
          ))}
        </ul>

        <p className="zone__note">
          Templeuve, Cysoing, Orchies, Pont-à-Marcq et Genech sont les communes où Albert
          intervient le plus souvent, en plomberie comme en petits travaux.
        </p>
      </div>
    </section>
  )
}
