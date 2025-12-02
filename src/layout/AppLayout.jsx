import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/places', label: 'Places' },
  { to: '/people', label: 'People' },
  { to: '/chat', label: 'Talk to History' },
]

const AppLayout = ({ children }) => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="content-container header-inner">
          <NavLink to="/" className="brand">
            Places in Time
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
        <div className="content-container">© {currentYear} Places in Time</div>
      </footer>
    </div>
  )
}

export default AppLayout
