import { Images } from 'lucide-react'
import { PhoneReveal } from '../phone.jsx'
import { EmailReveal } from '../email.jsx'
import { HAS_REALISATIONS } from './Realisations.jsx'

export default function Nav({ brandHref = '#top', realisationsHref = '#realisations' }) {
  return (
    <nav className="site-nav on-dark" aria-label="Navigation principale">
      <div className="container site-nav__inner">
        <a className="site-nav__brand" href={brandHref}>
          Albert à tout faire
        </a>
        <div className="site-nav__actions">
          {/* Lien affiché seulement quand des réalisations sont publiées */}
          {HAS_REALISATIONS ? (
            <a className="site-nav__link" href={realisationsHref}>
              <Images size={17} strokeWidth={2} aria-hidden="true" />
              {/* Sur mobile, le lien se réduit à son icône, comme le bouton du mail */}
              <span className="site-nav__link-label">Réalisations</span>
            </a>
          ) : null}
          <EmailReveal className="phone-reveal--nav" iconSize={17} />
          <PhoneReveal className="phone-reveal--nav" iconSize={17} />
        </div>
      </div>
    </nav>
  )
}
