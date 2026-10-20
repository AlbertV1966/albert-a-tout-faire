import { EmailReveal } from '../email.jsx'

export default function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__brand">Albert à tout faire</p>
          <p className="site-footer__place">Pévèle et Métropole de Lille</p>
        </div>
        <div className="site-footer__contact">
          <EmailReveal iconSize={17} />
          <a className="site-footer__link" href="#contact">
            Me contacter
          </a>
        </div>
      </div>
    </footer>
  )
}
