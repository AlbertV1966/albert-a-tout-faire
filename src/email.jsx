import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Mail } from 'lucide-react'
import { emailDisplay, emailHref } from './site.js'

/**
 * Même principe que le numéro : l'adresse reste hors du DOM tant que
 * personne ne l'a demandée. Une fois révélée quelque part, elle l'est
 * partout sur la page.
 */
const EmailContext = createContext(null)

export function EmailProvider({ children }) {
  const [revealed, setRevealed] = useState(false)
  const reveal = useCallback(() => setRevealed(true), [])

  const value = useMemo(
    () => ({
      revealed,
      reveal,
      display: revealed ? emailDisplay() : '',
      href: revealed ? emailHref() : '',
    }),
    [revealed, reveal],
  )

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
}

export function useEmail() {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmail doit être utilisé dans un EmailProvider')
  }
  return context
}

/**
 * Bouton qui révèle l'adresse, puis devient un lien mailto.
 * Reprend le balisage et les classes de PhoneReveal pour un rendu identique.
 */
export function EmailReveal({ className = '', iconSize = 18, label = 'Afficher le mail' }) {
  const { revealed, reveal, display, href } = useEmail()
  // Coupure possible après l'arobase, pour les écrans étroits
  const at = display.indexOf('@') + 1

  return (
    <span className={className ? `phone-reveal email-reveal ${className}` : 'phone-reveal email-reveal'}>
      <span aria-live="polite">
        {revealed ? (
          <a className="phone-reveal__link" href={href}>
            <Mail size={iconSize} strokeWidth={2} aria-hidden="true" />
            <span className="email-reveal__address">
              {display.slice(0, at)}
              <wbr />
              {display.slice(at)}
            </span>
          </a>
        ) : null}
      </span>
      {revealed ? null : (
        <button type="button" className="phone-reveal__button" onClick={reveal}>
          <Mail size={iconSize} strokeWidth={2} aria-hidden="true" />
          <span className="email-reveal__label">{label}</span>
        </button>
      )}
    </span>
  )
}
