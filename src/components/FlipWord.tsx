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

  const maxLen = Math.max(word.length, flipTo.length)
  const chars = word.padEnd(maxLen, '\u00A0').split('')

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
      {chars.map((char, i) => (
        <CharFlip
          key={i}
          char={char}
          flipToChar={flipTo[i] || '\u00A0'}
          flipped={flipped}
          delayIn={i * 200}
          delayOut={(maxLen - 1 - i) * 200}
        />
      ))}
    </Tag>
  )
}

function CharFlip({
  char,
  flipToChar,
  flipped,
  delayIn,
  delayOut,
}: {
  char: string
  flipToChar: string
  flipped: boolean
  delayIn: number
  delayOut: number
}) {
  return (
    <span
      style={{
        display: 'inline-grid',
        gridTemplate: '1fr / 1fr',
        position: 'relative',
        transition: `transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) ${flipped ? delayIn : delayOut}ms`,
        transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      <span
        style={{
          gridArea: '1/1',
          backfaceVisibility: 'hidden',
        }}
      >
        {char}
      </span>
      <span
        style={{
          gridArea: '1/1',
          backfaceVisibility: 'hidden',
          transform: 'rotateX(180deg)',
        }}
      >
        {flipToChar}
      </span>
    </span>
  )
}
