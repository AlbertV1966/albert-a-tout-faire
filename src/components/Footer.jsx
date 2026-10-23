import { EmailReveal } from '../email.jsx'

export default function Footer({ contactHref = '#contact' }) {
  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__brand">Albert à tout faire</p>
          <p className="site-footer__place">Pévèle et Métropole de Lille</p>
        </div>
        <div className="site-footer__contact">
          <EmailReveal iconSize={17} />
          <a className="site-footer__link" href={contactHref}>
            Me contacter
          </a>
        </div>
      </div>
      <div className="container">
        <div className="site-footer__legal">
          <p>
            Albert Vanbremeersch, entrepreneur individuel, Pont-à-Marcq. SIREN en cours
            d’attribution. TVA non applicable, art. 293 B du CGI.
          </p>
          <a className="site-footer__legal-link" href="/mentions-legales.html">
            Mentions légales
          </a>
        </div>
      </div>
    </footer>
  )
}
