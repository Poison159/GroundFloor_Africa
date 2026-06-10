import { useState, useEffect, useRef } from 'react'
import RedactedReveal from './RedactedReveal'
import PhoneCollage from './PhoneCollage'
import ImageCycler from './ImageCycler'
import { FaReact } from 'react-icons/fa'
import { SiExpo, SiDotnet, SiMongodb, SiXstate, SiReactquery, SiGooglecloud, SiFirebase, SiCss, SiMui, SiStripe } from 'react-icons/si'

const techIconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'React': FaReact,
  'React Native': FaReact,
  'Expo': SiExpo,
  '.NET Core': SiDotnet,
  'MongoDB': SiMongodb,
  'XState': SiXstate,
  'TanStack Query': SiReactquery,
  'GCP': SiGooglecloud,
  'Firebase': SiFirebase,
  'CSS': SiCss,
  'Material UI': SiMui,
  'Stripe': SiStripe,
}

const ease = '0.6s cubic-bezier(0.65, 0, 0.35, 1)'

interface AnimatedCardProps {
  title: string
  description: string
  tags: string[]
  image: string
  imageHover?: string
  images?: string[]
  video?: string
  appStore?: string
  playStore?: string
  url?: string
  color: string
  index: number
  phoneCollage?: boolean
  cardIndex?: number
}

export default function AnimatedCard({ title, description, tags, image, imageHover, images, video, appStore, playStore, url, color, index, phoneCollage, cardIndex }: AnimatedCardProps) {
  const [active, setActive] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`@keyframes zoomBurst { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }`}</style>
      <div
      ref={cardRef}
      style={{
        display: 'flex',
        flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
        gap: '3rem',
        alignItems: 'center',
        padding: '3rem 0',
        opacity: active ? 1 : 0,
        transform: active
          ? 'translateY(0) scale(1)'
          : 'translateY(60px) scale(0.95)',
        transition: 'all 2s cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 3,
            background: color,
            borderRadius: 2,
            marginBottom: '1rem',
          }}
        />
        <RedactedReveal
          lines={[title]}
          as="h3"
          stagger={120}
          style={{
            color: '#fff',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        />
        <RedactedReveal
          lines={[description]}
          as="p"
          stagger={120}
          barColor="rgba(210,255,0,0.15)"
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginTop: '1rem',
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
          {tags.map((tag, i) => {
            const IconComp = techIconMap[tag]
            return (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.85rem 0.2rem 0.35rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(210,255,0,0.25)',
                  borderRadius: 100,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateX(0)' : 'translateX(-24px)',
                  transition: `all 0.5s cubic-bezier(0.65, 0, 0.35, 1) ${i * 0.3}s`,
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'rgba(210,255,0,0.12)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {IconComp ? (
                    <IconComp size={11} color="rgba(210,255,0,0.7)" />
                  ) : (
                    <span style={{ fontSize: '0.45rem', color: 'rgba(210,255,0,0.5)', fontWeight: 700 }}>
                      {tag.charAt(0)}
                    </span>
                  )}
                </span>
                {tag}
              </span>
            )
          })}
        </div>
        {appStore && playStore && (
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '1.25rem',
              justifyContent: 'flex-start',
              animation: active ? 'zoomBurst 0.6s ease-out' : 'none',
            }}
          >
            <a href={appStore} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
              <img src="/apple-app-store-badge.svg" alt="Download on the App Store" style={{ height: 44, width: 'auto', display: 'block' }} />
            </a>
            <a href={playStore} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
              <img src="/google-play-badge.svg" alt="Get it on Google Play" style={{ height: 44, width: 'auto', display: 'block' }} />
            </a>
          </div>
        )}
        {url && (
          <div style={{ marginTop: '1.25rem' }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1.25rem',
                border: '1.5px solid #d2ff00',
                borderRadius: 100,
                color: '#d2ff00',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                background: 'transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#d2ff00'; e.currentTarget.style.color = '#0a0a0a' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d2ff00' }}
            >
              visit website
            </a>
          </div>
        )}
      </div>

      {phoneCollage ? (
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flexShrink: 0,
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
              marginBottom: '3rem',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                color: '#d2ff00',
                lineHeight: 1.3,
                textShadow: '0 0 40px rgba(210,255,0,0.15)',
                userSelect: 'none',
              }}
            >
              Psss...hey you 🫵, come hover here!
            </span>
          </div>
          <div
            data-card-image={cardIndex}
            style={{
              aspectRatio: '4/3',
              width: '100%',
              opacity: active ? 1 : 0,
              transform: active ? 'translateX(0)' : 'translateX(30px)',
              transition: 'all 2s cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          >
            <PhoneCollage video={video} />
          </div>
        </div>
      ) : images ? (
        <div
          data-card-image={cardIndex}
          style={{
            flex: 1.2,
            minWidth: 0,
            aspectRatio: '4/3',
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
            background: '#111',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <ImageCycler images={images} alt={title} />
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.25rem',
              zIndex: 2,
              opacity: active && !hovered ? 1 : 0,
              transition: 'opacity 0.4s',
            }}
          >
            <span
              style={{
                color: '#d2ff00',
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
              hover me
            </span>
          </div>
        </div>
      ) : (
        <div
          data-card-image={cardIndex}
          style={{
            flex: 1.2,
            minWidth: 0,
            aspectRatio: '4/3',
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
            background: '#111',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {imageHover ? (
            <>
              <img
                src={image}
                alt={title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: hovered ? 0 : 1,
                  transform: hovered ? 'scale(0.95)' : 'scale(1)',
                  transition: `opacity ${ease}, transform ${ease}`,
                }}
              />
              <img
                src={imageHover}
                alt={`${title} hover`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: hovered ? 1 : 0,
                  transform: hovered ? 'scale(1)' : 'scale(1.1)',
                  transition: `opacity ${ease}, transform ${ease}`,
                }}
              />
            </>
          ) : (
            <img
              src={image}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transform: active ? 'scale(1)' : 'scale(1.15)',
                transition: 'transform 2s cubic-bezier(0.65, 0, 0.35, 1)',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.25rem',
              zIndex: 2,
              opacity: active && !hovered ? 1 : 0,
              transition: 'opacity 0.4s',
            }}
          >
            <span
              style={{
                color: '#d2ff00',
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
              hover me
            </span>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
