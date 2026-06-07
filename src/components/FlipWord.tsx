import { useState } from 'react'

interface FlipWordProps {
  word: string
  flipTo: string
  as?: 'span' | 'h1' | 'h2' | 'h3'
  style?: React.CSSProperties
  flipped?: boolean
}

export default function FlipWord({ word, flipTo, as = 'span', style, flipped: controlledFlipped }: FlipWordProps) {
  const [internalFlipped, setInternalFlipped] = useState(false)
  const isControlled = controlledFlipped !== undefined
  const flipped = isControlled ? controlledFlipped : internalFlipped
  const Tag = as

  return (
    <Tag
      onMouseEnter={isControlled ? undefined : () => setInternalFlipped(true)}
      onMouseLeave={isControlled ? undefined : () => setInternalFlipped(false)}
      style={{
        display: 'inline-block',
        perspective: 600,
        cursor: 'pointer',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          position: 'relative',
          transition: 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)',
          transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            backfaceVisibility: 'hidden',
          }}
        >
          {word}
        </span>
        <span
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {flipTo}
        </span>
      </span>
    </Tag>
  )
}
