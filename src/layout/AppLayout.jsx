import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/places', label: 'Places' },
  { to: '/people', label: 'People' },
  { to: '/chat', label: 'Talk to History' },
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
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? 'nav-link is-active' : 'nav-link'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="site-main">
        <div className="content-container">{children}</div>
      </main>
      <footer className="site-footer">
        <div className="content-container footer-grid">
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
              <small>© {currentYear} Places in Time</small>
            </div>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            <p>
              <NavLink to="/places">Places atlas</NavLink>
            </p>
            <p>
              <NavLink to="/people">Figures roster</NavLink>
            </p>
            <p>
              <NavLink to="/chat">Talk to history</NavLink>
            </p>
            <p>
              <NavLink to="/shop">Shop preview</NavLink>
            </p>
          </div>
          <div>
            <p className="eyebrow">Stay in touch</p>
            <p>hello@placesintime.app</p>
            <p>Design system v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
