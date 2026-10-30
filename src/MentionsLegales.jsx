import { PhoneProvider, PhoneReveal } from './phone.jsx'
import { EmailProvider, EmailReveal } from './email.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'

export default function MentionsLegales() {
  return (
    <PhoneProvider>
      <EmailProvider>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>

        <Nav brandHref="/" realisationsHref="/#realisations" />

        <main id="contenu" tabIndex={-1}>
          <section className="section section--white" aria-labelledby="mentions-titre">
            <div className="container">
              <h1 className="title-section" id="mentions-titre">
                Mentions légales
              </h1>

              <div className="legal">
                <section className="legal__block" aria-labelledby="editeur-titre">
                  <h2 className="title-item" id="editeur-titre">
                    Éditeur du site
                  </h2>
                  <p>
                    Albert Vanbremeersch, entrepreneur individuel
                    <br />
                    Pont-à-Marcq (59710)
                  </p>
                  {/* Numéro et adresse e-mail révélés au clic, comme sur l'accueil */}
                  <p>
                    Téléphone : <PhoneReveal className="phone-reveal--inline" iconSize={19} />
                  </p>
                  <p>
                    E-mail :{' '}
                    <EmailReveal className="phone-reveal--inline" iconSize={19} />
                  </p>
                  {/* À mettre à jour dès l'attribution du numéro SIREN */}
                  <p>SIREN : en cours d’attribution.</p>
                  <p>TVA non applicable, article 293 B du CGI.</p>
                </section>

                <section className="legal__block" aria-labelledby="publication-titre">
                  <h2 className="title-item" id="publication-titre">
                    Directeur de la publication
                  </h2>
                  <p>Albert Vanbremeersch.</p>
                </section>

                <section className="legal__block" aria-labelledby="hebergement-titre">
                  <h2 className="title-item" id="hebergement-titre">
                    Hébergement
                  </h2>
                  <p>
                    Vercel Inc.
                    <br />
                    440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
                    <br />
                    <a className="legal__link" href="https://vercel.com">
                      vercel.com
                    </a>
                  </p>
                </section>

                <section className="legal__block" aria-labelledby="donnees-titre">
                  <h2 className="title-item" id="donnees-titre">
                    Données personnelles
                  </h2>
                  <p>
                    Le formulaire de contact collecte votre nom, votre téléphone, votre commune
                    et la description de votre besoin, uniquement pour répondre à votre demande.
                    Ces données sont envoyées par e-mail à l’artisan, via le service d’envoi de
                    formulaires Web3Forms. Elles ne sont pas revendues et sont conservées le
                    temps du traitement de votre demande.
                  </p>
                  <p>
                    Le formulaire d’avis collecte votre prénom, l’initiale de votre nom, votre
                    commune, le type de travaux, votre note et votre commentaire, uniquement pour
                    publier votre avis sur le site après vérification. Ces données sont envoyées
                    par e-mail à l’artisan, via le même service Web3Forms. Un avis n’est publié
                    qu’avec votre consentement, donné en cochant la case prévue à cet effet.
                    Seuls sont alors publiés le prénom, l’initiale du nom, la commune, le type de
                    travaux, la note, le commentaire et la date de dépôt. Les avis non publiés
                    sont supprimés.
                  </p>
                  {/* Adresse révélée au clic, comme dans la rubrique Éditeur */}
                  <p>
                    Vous pouvez demander à tout moment la modification ou la suppression de votre
                    avis en écrivant à{' '}
                    <EmailReveal className="phone-reveal--inline" iconSize={19} />
                  </p>
                  <p>
                    La police d’écriture du site est chargée depuis Google Fonts, ce qui transmet
                    l’adresse IP du visiteur à Google.
                  </p>
                  <p>
                    Vous disposez d’un droit d’accès, de rectification et de suppression de vos
                    données : il suffit d’écrire à l’adresse e-mail indiquée ci-dessus.
                  </p>
                </section>

                <section className="legal__block" aria-labelledby="cookies-titre">
                  <h2 className="title-item" id="cookies-titre">
                    Cookies
                  </h2>
                  <p>Ce site ne dépose aucun cookie de suivi ni de mesure d’audience.</p>
                </section>
              </div>
            </div>
          </section>
        </main>

        <Footer contactHref="/#contact" />
      </EmailProvider>
    </PhoneProvider>
  )
}
