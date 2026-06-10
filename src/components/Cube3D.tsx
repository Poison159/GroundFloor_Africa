export default function Cube3D({ progress }: { progress: number }) {
  const size = 160
  const half = size / 2
  const finalSize = size * 0.5
  const gap = 2
  const step = finalSize + gap

  const clamped = Math.min(1, progress)

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const startX = vw - 0.08 * vw - size
  const targetX = 250
  const x = startX + (targetX - startX) * clamped

  const scale = 1 - clamped * 0.5

  const rotationPeak = 0.7
  const rotationFactor = clamped <= rotationPeak
    ? clamped / rotationPeak
    : (1 - clamped) / (1 - rotationPeak)

  const rotateX = rotationFactor * 540
  const rotateY = rotationFactor * 900

  const opacity = progress < 0.05
    ? progress / 0.05
    : progress > 1
      ? Math.max(0, 1 - (progress - 1) * 4)
      : 1

  const flattenT = Math.max(0, Math.min(1, (clamped - 0.7) / 0.3))
  const flattenFactor = 1 - flattenT
  const z = half * flattenFactor

  const transforms = [
    `translateZ(${z}px)`,
    `rotateY(180deg) translateZ(${z}px)`,
    `rotateY(90deg) translateZ(${z}px)`,
    `rotateY(-90deg) translateZ(${z}px)`,
    `rotateX(90deg) translateZ(${z}px)`,
    `rotateX(-90deg) translateZ(${z}px)`,
  ]

  const faceLabels = ['front', 'back', 'right', 'left', 'top', 'bottom']

  const pileVisible = clamped >= 0.7
  const pileOpacity = Math.min(1, (clamped - 0.7) / 0.15)

  const pileLeft = targetX + 40
  const pileTop = 'calc(45% - 40px)'

  const squareStyle: React.CSSProperties = {
    width: finalSize,
    height: finalSize,
    background: 'rgba(210, 255, 0, 0.08)',
    border: '1px solid rgba(210, 255, 0, 0.2)',
    boxShadow: 'inset 0 0 40px rgba(210, 255, 0, 0.03)',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        opacity,
      }}
    >
      {pileVisible && (
        <div
          style={{
            position: 'absolute',
            left: pileLeft,
            top: pileTop,
            width: step * 2,
            height: step * 2,
            opacity: pileOpacity,
          }}
        >
          <div style={{ position: 'absolute', left: step, top: 0, ...squareStyle }} />
          <div style={{ position: 'absolute', left: 0, top: step, ...squareStyle }} />
          <div style={{ position: 'absolute', left: step, top: step, ...squareStyle }} />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: 0,
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          transform: `translate(${x}px, -50%) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {faceLabels.map((label, i) => (
          <div
            key={label}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              background: `rgba(210, 255, 0, ${0.08 + i * 0.04})`,
              border: `1px solid rgba(210, 255, 0, ${0.2 + i * 0.03})`,
              transform: transforms[i],
              backfaceVisibility: 'hidden',
              boxShadow: `inset 0 0 40px rgba(210, 255, 0, ${0.03 + i * 0.02})`,
              opacity: i === 0 ? 1 : Math.pow(flattenFactor, 3),
            }}
          />
        ))}
      </div>
    </div>
  )
}
