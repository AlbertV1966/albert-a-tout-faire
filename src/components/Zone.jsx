import { COMMUNES_METROPOLE, COMMUNES_PEVELE } from '../site.js'

export default function Zone() {
  return (
    <section className="section section--mist" id="zone">
      <div className="container">
        <div className="section-head">
          <h2 className="title-section">La Pévèle et toute la Métropole de Lille</h2>
        </div>
        <p className="lead">
          Albert est installé en Pévèle et se déplace dans les communes autour. Votre
          commune n’est pas dans la liste ? Demandez quand même.
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
          Les cinq premières communes sont celles où Albert intervient le plus souvent.
        </p>
      </div>
    </section>
  )
}
