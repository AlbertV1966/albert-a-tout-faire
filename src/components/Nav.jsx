import { PhoneReveal } from '../phone.jsx'
import { EmailReveal } from '../email.jsx'

export default function Nav({ brandHref = '#top' }) {
  return (
    <nav className="site-nav on-dark" aria-label="Navigation principale">
      <div className="container site-nav__inner">
        <a className="site-nav__brand" href={brandHref}>
          Albert à tout faire
        </a>
        <div className="site-nav__actions">
          <EmailReveal className="phone-reveal--nav" iconSize={17} />
          <PhoneReveal className="phone-reveal--nav" iconSize={17} />
        </div>
      </div>
    </nav>
  )
}
