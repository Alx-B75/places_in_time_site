import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'pit_cookie_consent_v1'

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie consent">
      <div className="cookie-banner__content">
        <div className="cookie-banner__text">
          <p className="eyebrow">Cookies &amp; privacy</p>
          <p>
            We use essential cookies to keep Places in Time secure and to understand which pages resonate. Review the{' '}
            <Link to="/privacy-policy-gdpr">privacy policy</Link> to learn more.
          </p>
        </div>
        <button type="button" className="button primary" onClick={handleAccept}>
          Accept and continue
        </button>
      </div>
    </div>
  )
}

export default CookieBanner
