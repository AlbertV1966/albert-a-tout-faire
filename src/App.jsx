import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Zone from './components/Zone.jsx'
import WhyAlbert from './components/WhyAlbert.jsx'
import ContactForm from './components/ContactForm.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <div id="top">
        <Hero />
      </div>

      <main id="contenu" tabIndex={-1}>
        <Services />
        <Zone />
        <WhyAlbert />
        <ContactForm />
      </main>

      <Footer />
    </>
  )
}
