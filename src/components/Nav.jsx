import { PhoneReveal } from '../phone.jsx'

export default function Nav() {
  return (
    <nav className="site-nav on-dark" aria-label="Navigation principale">
      <div className="container site-nav__inner">
        <a className="site-nav__brand" href="#top">
          Albert à tout faire
        </a>
        <PhoneReveal className="phone-reveal--nav" iconSize={17} />
      </div>
    </nav>
  )
}
