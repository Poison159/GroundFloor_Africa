export default function Cube3D({ progress }: { progress: number }) {
  const size = 160
  const half = size / 2

  const clamped = Math.min(1, progress)
  const scale = 1 - clamped * 0.65
  const rotateX = clamped * 540
  const rotateY = clamped * 900

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const startX = vw - 0.08 * vw - size
  const endX = 48
  const x = startX + (endX - startX) * clamped

  const opacity = progress < 0.05
    ? progress / 0.05
    : progress > 1
      ? Math.max(0, 1 - (progress - 1) * 4)
      : 1

  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom']
  const transforms = [
    `translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ]

  return (
    <div
      style={{
        position: 'fixed',
        top: '45%',
        left: 0,
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
        transform: `translate(${x}px, -50%) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        zIndex: 5,
        pointerEvents: 'none',
        opacity,
      }}
    >
      {faces.map((face, i) => (
        <div
          key={face}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            background: `rgba(210, 255, 0, ${0.08 + i * 0.04})`,
            border: `1px solid rgba(210, 255, 0, ${0.2 + i * 0.03})`,
            transform: transforms[i],
            backfaceVisibility: 'hidden',
            boxShadow: `inset 0 0 40px rgba(210, 255, 0, ${0.03 + i * 0.02})`,
          }}
        />
      ))}
    </div>
  )
}
