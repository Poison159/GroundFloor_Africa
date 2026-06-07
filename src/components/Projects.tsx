import { useState, useCallback, useRef, useEffect } from 'react'
import data from '../data/portfolio.json'
import { useScrollReveal } from '../hooks/useScrollReveal'
import AnimatedCard from './AnimatedCard'

export default function Projects() {
  const { ref, visible } = useScrollReveal(0.05)

  const [projectIndex, setProjectIndex] = useState(0)
  const [dismissing, setDismissing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [cardsRevealed, setCardsRevealed] = useState(false)
  const [cardEntryDone, setCardEntryDone] = useState(false)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsRevealed(true)
          setTimeout(() => setCardEntryDone(true), 1900)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const dismiss = useCallback(() => {
    if (dismissing) return
    setDismissing(true)
    setTimeout(() => {
      setProjectIndex(i => (i + 1) % data.portfolio.length)
      setDismissing(false)
      setHovered(false)
    }, 400)
  }, [dismissing])

  const visibleCards = []
  const numVisible = Math.min(4, data.portfolio.length)
  for (let i = 0; i < numVisible; i++) {
    visibleCards.push({
      project: data.portfolio[(projectIndex + i) % data.portfolio.length],
      stackIndex: i,
    })
  }

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        padding: '6rem 3rem',
        background: '#0a0a0a',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          transition: 'all 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 3,
            background: '#d2ff00',
            borderRadius: 2,
            marginBottom: '1rem',
          }}
        />
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Featured{' '}
          <span style={{ color: '#d2ff00' }}>Projects</span>
        </h2>

        {/* Animated Cards - scroll reveal */}
        <div style={{ marginTop: '3rem' }}>
          {data.portfolio.map((project, i) => (
            <AnimatedCard
              key={project.id}
              title={project.title}
              description={project.description}
              tags={project.tech}
              image={project.image}
              color={project.color}
              index={i}
            />
          ))}
        </div>

        {/* Tinder-like Swipe Cards */}
        <div ref={cardsRef} style={{ marginTop: '6rem' }}>
          <div
            style={{
              width: 40,
              height: 3,
              background: '#d2ff00',
              borderRadius: 2,
              marginBottom: '1rem',
            }}
          />
          <h3
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 700,
              color: '#fff',
              margin: 0,
            }}
          >
            Hover to{' '}
            <span style={{ color: '#d2ff00' }}>Reveal</span>
          </h3>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '2rem',
              perspective: 1200,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 820,
                aspectRatio: '1.6 / 1',
              }}
            >
              {visibleCards.map(({ project, stackIndex }) => {
                const isTop = stackIndex === 0
                const offset = stackIndex * 12
                const scale = 1 - stackIndex * 0.03
                const rot = stackIndex * 1.5
                const isEntering = cardsRevealed && !cardEntryDone
                const staggerDelay = (numVisible - 1 - stackIndex) * (1.5 / numVisible)

                const entryTransform = `translateY(${offset + 60}px) scale(${scale}) rotate(${rot}deg)`
                const finalTransform = `translateY(${offset}px) scale(${scale}) rotate(${rot}deg)`

                return (
                  <div
                    key={`${projectIndex}-${project.id}`}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: 16,
                      overflow: 'hidden',
                      background: '#111',
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isTop
                        ? '0 20px 60px rgba(0,0,0,0.5)'
                        : '0 8px 30px rgba(0,0,0,0.4)',
                      transform: cardsRevealed ? finalTransform : entryTransform,
                      opacity: cardsRevealed ? (dismissing && isTop ? 0 : 1) : 0,
                      transition: isEntering
                        ? `transform 0.5s cubic-bezier(0.65, 0, 0.35, 1) ${staggerDelay}s, opacity 0.5s ease ${staggerDelay}s`
                        : dismissing
                          ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease'
                          : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
                      cursor: isTop ? 'pointer' : 'default',
                      zIndex: 10 - stackIndex,
                      pointerEvents: isTop ? 'auto' : 'none',
                      userSelect: 'none',
                    }}
                    className={isTop && dismissing ? 'swipe-dismiss' : ''}
                    onClick={isTop ? dismiss : undefined}
                    onMouseEnter={isTop ? () => setHovered(true) : undefined}
                    onMouseLeave={isTop ? () => setHovered(false) : undefined}
                  >
                    {/* Default image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isTop && hovered ? 0 : 1,
                        transform: isTop && hovered ? 'scale(0.95)' : 'scale(1)',
                        transition: isTop
                          ? 'opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1), transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)'
                          : 'none',
                      }}
                    />
                    {/* Hover image */}
                    <img
                      src={project.imageHover}
                      alt={`${project.title} hover`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isTop && hovered ? 1 : 0,
                        transform: isTop && hovered ? 'scale(1)' : 'scale(1.1)',
                        transition: isTop
                          ? 'opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1), transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)'
                          : 'none',
                      }}
                    />
                    {/* Gradient overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                        opacity: isTop && hovered ? 1 : 0,
                        transition: isTop ? 'opacity 0.4s' : 'none',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Click to swipe hint */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '1.25rem',
                        left: '1.25rem',
                        zIndex: 2,
                        opacity: isTop && !hovered ? 0.7 : 0,
                        transition: isTop ? 'opacity 0.4s' : 'none',
                      }}
                    >
                      <span
                        style={{
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                          background: 'rgba(0,0,0,0.4)',
                          padding: '0.35rem 0.85rem',
                          borderRadius: 100,
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        click to swipe
                      </span>
                    </div>

                    {/* Title badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1.5rem',
                        left: '1.5rem',
                        zIndex: 2,
                        opacity: isTop ? 1 : 0,
                        transition: isTop ? 'opacity 0.4s 0.1s' : 'none',
                      }}
                    >
                      <p
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        }}
                      >
                        {project.title}
                      </p>
                    </div>

                    {/* Stack number */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        zIndex: 2,
                        opacity: isTop ? 0.4 : 0.15,
                      }}
                    >
                      <span
                        style={{
                          color: '#fff',
                          fontSize: '2rem',
                          fontWeight: 700,
                        }}
                      >
                        {(projectIndex + stackIndex + 1).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <style>{`
            .swipe-dismiss {
              transform: translateX(120%) rotate(16deg) !important;
              opacity: 0 !important;
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease !important;
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}
