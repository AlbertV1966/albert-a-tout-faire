import { useEffect } from 'react'
import { PhoneProvider } from './phone.jsx'
import { EmailProvider } from './email.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Formations from './components/Formations.jsx'
import Zone from './components/Zone.jsx'
import WhyAlbert from './components/WhyAlbert.jsx'
import Realisations from './components/Realisations.jsx'
import Avis from './components/Avis.jsx'
import ContactForm from './components/ContactForm.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  // Arrivée par un lien /#contact (depuis les mentions légales) : la page est
  // rendue après le chargement, le navigateur n'a pas trouvé l'ancre à temps.
  useEffect(() => {
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1))
    if (target) target.scrollIntoView()
  }, [])

  return (
    <PhoneProvider>
      <EmailProvider>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>

        <Nav />

        {/* Le titre H1 de la page vit dans le hero, donc à l'intérieur de main. */}
        <main id="contenu" tabIndex={-1}>
          <Hero />
          <Services />
          <Formations />
          <Zone />
          <WhyAlbert />
          <Realisations />
          <Avis />
          <ContactForm />
        </main>

        <Footer />
      </EmailProvider>
    </PhoneProvider>
  )
}
