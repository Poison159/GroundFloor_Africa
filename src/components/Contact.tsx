import { useScrollReveal } from '../hooks/useScrollReveal'
import data from '../data/portfolio.json'

export default function Contact() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 2rem 4rem',
        position: 'relative',
        background: '#050505',
        transition: 'background 0.8s',
      }}
    >
      <div
        style={{
          maxWidth: 600,
          textAlign: 'center',
          transition: 'all 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          transform: visible ? 'translateY(-110px)' : 'translateY(40px)',
          opacity: visible ? 1 : 0,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Let's{' '}
          <span style={{ color: '#d2ff00' }}>Build</span>
          <br />
          Together
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginTop: '1.25rem',
          }}
        >
          We're always looking for new projects. Whether you need an app, website, or analytics —
          we'd love to hear from you.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '2rem',
            alignItems: 'center',
          }}
        >
          <a
            href="mailto:info@groundfloor.africa"
            style={{
              color: '#fff',
              fontSize: '1.25rem',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.75rem 2rem',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 100,
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#d2ff00'
              e.currentTarget.style.color = '#000'
              e.currentTarget.style.borderColor = '#d2ff00'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            }}
          >
            info@groundfloor.africa
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '3rem',
            justifyContent: 'center',
          }}
        >
          {data.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#d2ff00')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
