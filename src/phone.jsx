import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Phone } from 'lucide-react'
import { phoneDisplay, phoneHref } from './site.js'

/**
 * Le numéro reste hors du DOM tant que personne ne l'a demandé.
 * Une fois révélé quelque part, il l'est partout sur la page.
 */
const PhoneContext = createContext(null)

export function PhoneProvider({ children }) {
  const [revealed, setRevealed] = useState(false)
  const reveal = useCallback(() => setRevealed(true), [])

  const value = useMemo(
    () => ({
      revealed,
      reveal,
      display: revealed ? phoneDisplay() : '',
      href: revealed ? phoneHref() : '',
    }),
    [revealed, reveal],
  )

  return <PhoneContext.Provider value={value}>{children}</PhoneContext.Provider>
}

export function usePhone() {
  const context = useContext(PhoneContext)
  if (!context) {
    throw new Error('usePhone doit être utilisé dans un PhoneProvider')
  }
  return context
}

/**
 * Bouton qui révèle le numéro, puis devient un lien d'appel.
 * La zone est annoncée aux lecteurs d'écran au moment de la révélation.
 */
export function PhoneReveal({ className = '', iconSize = 18, label = 'Afficher le numéro' }) {
  const { revealed, reveal, display, href } = usePhone()

  return (
    <span className={className ? `phone-reveal ${className}` : 'phone-reveal'}>
      <span aria-live="polite">
        {revealed ? (
          <a className="phone-reveal__link" href={href}>
            <Phone size={iconSize} strokeWidth={2} aria-hidden="true" />
            {display}
          </a>
        ) : null}
      </span>
      {revealed ? null : (
        <button type="button" className="phone-reveal__button" onClick={reveal}>
          <Phone size={iconSize} strokeWidth={2} aria-hidden="true" />
          {label}
        </button>
      )}
    </span>
  )
}
