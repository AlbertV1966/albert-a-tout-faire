import { Phone, Mail, MapPin } from 'lucide-react'
import { COMMUNES, EMAIL, PHONE_DISPLAY, PHONE_HREF } from '../site.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer on-dark">
      <div className="container">
        <div className="footer__top">
          <div>
            <p className="footer__title">Albert à tout faire</p>
            <p>
              Artisan multiservices en Pévèle. Électricité, plomberie, chauffage,
              peinture, montage de meubles et petits travaux.
            </p>
          </div>

          <div>
            <span className="footer__heading">Contact</span>
            <ul>
              <li>
                <a className="footer__link" href={PHONE_HREF}>
                  <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a className="footer__link" href={`mailto:${EMAIL}`}>
                  <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="footer__heading">Zone d’intervention</span>
            <p>
              <MapPin className="footer__pin" size={16} strokeWidth={1.5} aria-hidden="true" />
              Pévèle et périphérie de Lille : {COMMUNES.slice(0, 5).join(', ')} et le sud
              de la métropole lilloise.
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Albert à tout faire. Tous droits réservés.</span>
          <span>Entreprise artisanale. Devis gratuit sur simple demande.</span>
        </div>
      </div>
    </footer>
  )
}
