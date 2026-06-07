import { useState, useEffect, useRef } from 'react'

interface RedactedRevealProps {
  lines: string[]
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  style?: React.CSSProperties
  stagger?: number
  barColor?: string
  highlightIndex?: number
  highlightColor?: string
}

export default function RedactedReveal({
  lines,
  as = 'div',
  style,
  stagger = 200,
  barColor = '#d2ff00',
  highlightIndex,
  highlightColor,
}: RedactedRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const [revealCount, setRevealCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!triggered) return
    if (revealCount < lines.length) {
      const timer = setTimeout(() => setRevealCount(c => c + 1), stagger)
      return () => clearTimeout(timer)
    }
  }, [triggered, revealCount, lines.length, stagger])

  const Tag = as

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'block',
          }}
        >
          <Tag
            style={{
              margin: 0,
              color: highlightIndex === i && highlightColor ? highlightColor : undefined,
              lineHeight: 1.2,
              opacity: triggered && i < revealCount ? 1 : 1,
            }}
          >
            {line || '\u00A0'}
          </Tag>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: barColor,
              borderRadius: 2,
              transform: i < revealCount ? 'translateX(-102%)' : 'translateX(0%)',
              transition: 'transform 1.5s cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          />
        </div>
      ))}
    </div>
  )
}
