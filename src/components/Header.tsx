import { useState, useEffect } from 'react'

interface HeaderProps {
  activeSection: string
  cursorEnabled: boolean
  onToggleCursor: () => void
}

const links = [
  { id: 'hero', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
]

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

export default function Header({ activeSection, cursorEnabled, onToggleCursor }: HeaderProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 3rem',
        mixBlendMode: 'difference',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span
          style={{
            color: '#fff',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          GF<span style={{ color: '#d2ff00' }}>.</span>
        </span>
        <button
          onClick={onToggleCursor}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: `2px solid ${cursorEnabled ? '#d2ff00' : 'rgba(255,255,255,0.25)'}`,
            background: cursorEnabled ? '#d2ff00' : 'transparent',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
          }}
          aria-label="Toggle cursor trail"
        />
      </div>

      {/* Desktop links */}
      <div
        style={{
          display: isMobile ? 'none' : 'flex',
          gap: '2rem',
        }}
      >
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            style={{
              color: activeSection === link.id ? '#d2ff00' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'color 0.3s',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Hamburger button (mobile) */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        style={{
          display: isMobile ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
          width: 32,
          height: 32,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          zIndex: 110,
          position: 'relative',
        }}
        aria-label="Toggle menu"
      >
        <span
          style={{
            display: 'block',
            width: 24,
            height: 2,
            background: '#fff',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }}
        />
        <span
          style={{
            display: 'block',
            width: 24,
            height: 2,
            background: '#fff',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            opacity: menuOpen ? 0 : 1,
          }}
        />
        <span
          style={{
            display: 'block',
            width: 24,
            height: 2,
            background: '#fff',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
          }}
        />
      </button>

      {/* Side drawer overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 90,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Side drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 280,
          background: '#111',
          zIndex: 95,
          display: 'flex',
          flexDirection: 'column',
          padding: '6rem 2rem 2rem',
          gap: '1.5rem',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.65, 0, 0.35, 1)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={handleLinkClick}
            style={{
              color: activeSection === link.id ? '#d2ff00' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'color 0.3s',
              padding: '0.5rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
