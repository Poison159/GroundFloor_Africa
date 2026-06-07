import { useEffect, useRef } from 'react'
import data from '../data/portfolio.json'

export default function HorizontalScroll() {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) return

      const rect = container.getBoundingClientRect()
      const progress = -rect.top / (rect.height - window.innerHeight)
      const maxX = track.scrollWidth - window.innerWidth
      track.style.transform = `translateX(-${Math.min(progress * maxX, maxX)}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="work"
      ref={containerRef}
      style={{
        height: '300vh',
        position: 'relative',
        background: '#0a0a0a',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '3rem',
            padding: '0 3rem',
            willChange: 'transform',
          }}
        >
          <div
            style={{
              minWidth: '30vw',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingRight: '4rem',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 4rem)',
                fontWeight: 700,
                color: '#fff',
                margin: 0,
                lineHeight: 1,
              }}
            >
              What We
              <br />
              <span style={{ color: '#d2ff00' }}>Build</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '1rem', fontSize: '1rem', maxWidth: 320 }}>
              Scroll horizontally through our services
            </p>
          </div>
          {data.services.map((item, i) => (
            <div
              key={i}
              style={{
                minWidth: 380,
                height: 420,
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Background image */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.4s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              />
              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.2) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.08)',
                  lineHeight: 1,
                  zIndex: 1,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '2.5rem',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 3,
                    background: item.color,
                    marginBottom: '1.5rem',
                    borderRadius: 2,
                  }}
                />
                <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: 0, fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
                <span style={{ color: item.color, fontSize: '0.8rem', fontWeight: 600, marginTop: '1rem', letterSpacing: '0.05em' }}>
                  {item.stats}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
