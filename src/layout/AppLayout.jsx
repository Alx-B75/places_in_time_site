import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/places', label: 'Places' },
  { to: '/people', label: 'People' },
  { to: '/chat', label: 'Talk to History' },
  { to: '/news', label: 'History News' },
  { to: '/about', label: 'About' },
  { to: '/shop', label: 'Shop' },
]

const AppLayout = ({ children }) => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="content-container header-inner">
          <NavLink to="/" className="brand" aria-label="Places in Time home">
            <img
              src="/favicon.svg"
              width="48"
              height="48"
              alt=""
              aria-hidden="true"
              className="brand-mark"
              loading="lazy"
            />
            <span className="brand-text">
              <span className="brand-line">Places</span>
              <span className="brand-line">in Time</span>
            </span>
          </NavLink>
          <nav className="site-nav">
            {navLinks.map((link) => {
              if (link.href) {
                return (
                  <a
                    key={link.href}
                    className="nav-link"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                )
              }

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? 'nav-link is-active' : 'nav-link'
                  }
                >
                  {link.label}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="site-main">
        <div className="content-container">{children}</div>
      </main>
      <footer className="site-footer">
        <div className="content-container">
          <div className="footer-inner">
            <div className="footer-column">
              <div className="footer-brand">
                <img
                  src="/favicon.svg"
                  width="56"
                  height="56"
                  alt=""
                  aria-hidden="true"
                  className="brand-mark"
                  loading="lazy"
                />
                <div>
                  <p className="eyebrow">Places in Time</p>
                  <p>
                    A design system for historical storytelling products. Layer maps, people, and guided chat into one atlas.
                  </p>
                </div>
              </div>
              <div className="footer-links">
                <p>
                  <NavLink to="/about">About Places in Time</NavLink>
                </p>
                <p>
                  <NavLink to="/places">Places atlas</NavLink>
                </p>
                <p>
                  <NavLink to="/people">Figures roster</NavLink>
                </p>
                <p>
                  <NavLink to="/news">History News</NavLink>
                </p>
              </div>
            </div>
            <div className="footer-column">
              <p className="eyebrow">Legal</p>
              <p>
                <NavLink to="/privacy-policy-gdpr">Privacy & GDPR</NavLink>
              </p>
              <p>
                <NavLink to="/terms-of-use">Terms of Use</NavLink>
              </p>
              <p>
                <NavLink to="/impressum">Impressum</NavLink>
              </p>
            </div>
            <div className="footer-column">
              <p className="eyebrow">Follow</p>
              <div className="social-links">
                <a
                  href="https://www.facebook.com/placesintimedotcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Places in Time on Facebook"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M15 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h3v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1z"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/infoplacesintime/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Places in Time on Instagram"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M7 3C4.2 3 2 5.2 2 8v8c0 2.8 2.2 5 5 5h8c2.8 0 5-2.2 5-5V8c0-2.8-2.2-5-5-5H7zm0 2h8c1.7 0 3 1.3 3 3v8c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V8c0-1.7 1.3-3 3-3zm9 1a1 1 0 100 2 1 1 0 000-2zM11 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <small>© {currentYear} Places in Time. All rights reserved.</small>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
