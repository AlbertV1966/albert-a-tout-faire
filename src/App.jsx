import { PhoneProvider } from './phone.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Formations from './components/Formations.jsx'
import Zone from './components/Zone.jsx'
import WhyAlbert from './components/WhyAlbert.jsx'
import ContactForm from './components/ContactForm.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <PhoneProvider>
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
        <ContactForm />
      </main>

      <Footer />
    </PhoneProvider>
  )
}
