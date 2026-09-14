const REASONS = [
  {
    title: 'Devis gratuit',
    text: 'Prix clair avant de commencer.',
  },
  {
    title: 'Travail soigné',
    text: 'Finitions faites, chantier propre.',
  },
  {
    title: 'Intervention rapide',
    text: 'Réponse sous 48 h, dépannage dans la semaine.',
  },
]

export default function WhyAlbert() {
  return (
    <section className="section section--deep on-dark" id="pourquoi">
      <div className="container">
        <div className="section-head">
          <h2 className="title-section">
            Pas de plateforme, pas d’intermédiaire. Juste Albert.
          </h2>
        </div>

        <ul className="why__list">
          {REASONS.map((reason) => (
            <li className="why__item" key={reason.title}>
              <span className="why__bar" aria-hidden="true" />
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
