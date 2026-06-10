import { useState, useCallback, useRef, useEffect } from 'react'
import data from '../data/portfolio.json'
import { useScrollReveal } from '../hooks/useScrollReveal'
import AnimatedCard from './AnimatedCard'
import RedactedReveal from './RedactedReveal'

export default function Projects() {
  const { ref, visible } = useScrollReveal(0.05)

  const [projectIndex, setProjectIndex] = useState(0)
  const [dismissing, setDismissing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [sectionRevealed, setSectionRevealed] = useState(false)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const [cardsRevealed, setCardsRevealed] = useState(false)
  const [cardEntryDone, setCardEntryDone] = useState(false)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [arrowPos, setArrowPos] = useState({ x: 0, y: 0 })
  const smoothPathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el = cardsContainerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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

  useEffect(() => {
    const computeArrow = () => {
      const section = document.getElementById('projects')
      const container = section?.querySelector('[data-projects-container]') as HTMLElement | null
      const startMarker = section?.querySelector('[data-projects-path-start]') as HTMLElement | null
      const cards = section?.querySelectorAll<HTMLElement>('[data-card-image]')
      if (!container || !startMarker || !cards || cards.length === 0) return

      const containerRect = container.getBoundingClientRect()
      const startRect = startMarker.getBoundingClientRect()

      const startX = startRect.left - containerRect.left + startRect.width / 2
      const startY = startRect.top - containerRect.top + startRect.height / 2

      const points: { x: number; y: number }[] = [{ x: startX, y: startY }]

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const relX = rect.left - containerRect.left
        const relY = rect.top - containerRect.top
        const relRight = rect.right - containerRect.left
        const relBottom = rect.bottom - containerRect.top
        const relMidY = relY + (relBottom - relY) / 2

        if (i % 2 === 0) {
          points.push({ x: relRight + 20, y: relMidY - 16 })
          points.push({ x: relRight + 20, y: relMidY + 16 })
        } else {
          points.push({ x: relX - 20, y: relMidY + 16 })
          points.push({ x: relX - 20, y: relMidY - 16 })
        }
      })

      let maxBottom = startRect.bottom
      cards.forEach(card => {
        const r = card.getBoundingClientRect()
        maxBottom = Math.max(maxBottom, r.bottom)
      })

      const rawProgress = Math.max(0, Math.min(1,
        (window.innerHeight - startRect.top) / (window.innerHeight + (maxBottom - startRect.top))
      ))

      // Build expanded waypoints with S-curve swings between each pair
      const expanded: { x: number; y: number }[] = [points[0]]
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i]
        const b = points[i + 1]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const nx = -dy / dist
        const ny = dx / dist
        const swing = Math.min(50, dist * 0.35)
        const sign = i % 2 === 0 ? 1 : -1

        expanded.push({
          x: a.x + dx * 0.33 + nx * swing * sign,
          y: a.y + dy * 0.33 + ny * swing * sign,
        })
        expanded.push({
          x: a.x + dx * 0.67 - nx * swing * sign,
          y: a.y + dy * 0.67 - ny * swing * sign,
        })
        expanded.push(b)
      }

      // Catmull-rom smooth cubic bezier through expanded points
      const n = expanded.length
      let d = `M ${expanded[0].x} ${expanded[0].y}`
      for (let i = 0; i < n - 1; i++) {
        const pPrev = expanded[Math.max(0, i - 1)]
        const p1 = expanded[i]
        const p2 = expanded[i + 1]
        const pNext = expanded[Math.min(n - 1, i + 2)]
        const cp1x = p1.x + (p2.x - pPrev.x) / 6
        const cp1y = p1.y + (p2.y - pPrev.y) / 6
        const cp2x = p2.x - (pNext.x - p1.x) / 6
        const cp2y = p2.y - (pNext.y - p1.y) / 6
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
      }

      if (smoothPathRef.current) {
        smoothPathRef.current.setAttribute('d', d)
        const totalLen = smoothPathRef.current.getTotalLength()
        if (totalLen > 0) {
          const len = totalLen * rawProgress
          const clamped = Math.max(0, Math.min(totalLen, len))
          const pt = smoothPathRef.current.getPointAtLength(clamped)
          const prevPt = smoothPathRef.current.getPointAtLength(Math.max(0, clamped - 3))
          const angle = Math.atan2(pt.y - prevPt.y, pt.x - prevPt.x) * 180 / Math.PI + 90
          setArrowPos({ x: pt.x, y: pt.y })
        }
      }
    }

    window.addEventListener('scroll', computeArrow, { passive: true })
    computeArrow()
    return () => window.removeEventListener('scroll', computeArrow)
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
        data-projects-container
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
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
        <RedactedReveal
          lines={['Featured', 'Projects']}
          as="h2"
          stagger={250}
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
          }}
          highlightIndex={1}
          highlightColor="#d2ff00"
        />
        <span
          data-projects-path-start
          style={{
            position: 'absolute',
            left: '1rem',
            top: '5rem',
            opacity: 0,
            pointerEvents: 'none',
            userSelect: 'none',
            fontSize: 0,
          }}
          aria-hidden
        />
        <RedactedReveal
          lines={[
            'Modern apps, websites, and data analytics',
            'built for Africa.',
          ]}
          as="p"
          stagger={200}
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
            lineHeight: 1.6,
            marginTop: '0.75rem',
            maxWidth: 520,
          }}
          barColor="rgba(210,255,0,0.3)"
        />

        {/* Animated Cards - scroll reveal */}
        <div ref={cardsContainerRef} style={{ marginTop: '3rem' }}>
          {data.portfolio.map((project, i) => (
            <AnimatedCard
              key={project.id}
              title={project.title}
              description={project.description}
              tags={project.tech}
              image={project.image}
              imageHover={project.imageHover}
              images={project.images}
              video={project.video}
              appStore={project.appStore}
              playStore={project.playStore}
              url={project.url}
              color={project.color}
              index={i}
              cardIndex={i}
              phoneCollage={project.id === 'project-1'}
            />
          ))}
        </div>

        {/* Scroll-driven arrow that hops through cards */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: -1,
            opacity: sectionRevealed ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          <path ref={smoothPathRef} d="" fill="none" stroke="none" />
          {arrowPos.y > 0 && (
            <g
              transform={`translate(${arrowPos.x},${arrowPos.y})`}
              style={{ transition: 'transform 0.15s linear' }}
            >
              <circle cx="0" cy="0" r="10" fill="none" stroke="#d2ff00" strokeWidth="2" opacity="0.2" />
              <circle cx="0" cy="0" r="6" fill="none" stroke="#d2ff00" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2.5" fill="#d2ff00" />
            </g>
          )}
        </svg>

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
