export default function Formations() {
  return (
    <section
      className="section section--white section--ruled"
      id="formations"
      aria-labelledby="formations-titre"
    >
      <div className="container split split--media">
        <figure className="photo photo--portrait">
          <picture>
            <source srcSet="/images/albert-portrait.webp" type="image/webp" />
            <img
              src="/images/albert-portrait.jpg"
              width="1000"
              height="1250"
              loading="lazy"
              decoding="async"
              alt="Albert, artisan multiservices en Pévèle"
            />
          </picture>
        </figure>

        <div>
          <span className="pill">Formations et expérience</span>
          <h2 className="title-section" id="formations-titre">
            Un métier appris sur le terrain, et sur les bancs.
          </h2>

          <div className="parcours">
            <p>
              Albert a passé plus de 28 ans dans le secteur du sanitaire, du chauffage et de la
              plomberie, d’abord comme responsable produit puis comme responsable grands comptes
              chez Van Marcke, distributeur spécialisé. Diplômé d’un DUT Thermique et d’un master
              en physico-chimie et économie d’énergie, il connaît la technique autant que le
              terrain : conseil aux installateurs, bureaux d’études et architectes, choix des
              produits, suivi des chantiers.
            </p>
            <p>
              Aujourd’hui à son compte, il met cette expérience au service des particuliers et
              des commerçants : petites réparations, petit bricolage, peinture, dépannage et
              petits travaux du quotidien. Ce qu’il en garde : la rigueur du métier, le goût
              du travail propre et le respect des règles de sécurité.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
