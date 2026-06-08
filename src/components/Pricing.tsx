import { useScrollReveal } from '../hooks/useScrollReveal'
import data from '../data/portfolio.json'

function PricingCard({ plan, index }: { plan: typeof data.pricing[0]; index: number }) {
  const { ref, visible } = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        minWidth: 280,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '2.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.6s cubic-bezier(0.65, 0, 0.35, 1) ${index * 0.1}s`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          width: 40,
          height: 3,
          background: index === 0 ? '#667eea' : index === 1 ? '#d2ff00' : '#e17055',
          borderRadius: 2,
          marginBottom: '1rem',
        }}
      />
      <h3
        style={{
          color: '#fff',
          fontSize: '1.5rem',
          fontWeight: 600,
          margin: 0,
        }}
      >
        {plan.title}
      </h3>
      <p
        style={{
          color: '#d2ff00',
          fontSize: '2rem',
          fontWeight: 700,
          marginTop: '0.5rem',
        }}
      >
        {plan.startPrice}
      </p>
      <p
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          marginTop: '0.75rem',
          flex: 1,
        }}
      >
        {plan.description}
      </p>
      <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
        {plan.features.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: i < plan.features.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <div>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>
                {f.title}
              </span>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
                {f.desc}
              </p>
            </div>
            <span
              style={{
                color: '#d2ff00',
                fontSize: '0.9rem',
                fontWeight: 700,
                marginLeft: '1rem',
                whiteSpace: 'nowrap',
              }}
            >
              {f.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Pricing() {
  const { ref, visible } = useScrollReveal(0.05)

  return (
    <section
      id="pricing"
      ref={ref}
      style={{
        padding: '6rem 3rem 1rem',
        background: '#050505',
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
            display: 'flex',
            gap: '3rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
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
              Affordable{' '}
              <span style={{ color: '#d2ff00' }}>Pricing</span>
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '1rem',
                marginTop: '0.75rem',
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              Expertly built by senior developers — at a fraction of the cost. We leverage AI to deliver fast,
              but every solution is handcrafted, reviewed, and production-ready.
            </p>
          </div>

          <div
            style={{
              flexShrink: 0,
              maxWidth: '30%',
              minWidth: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: visible ? 'translateX(0)' : 'translateX(60px)',
              opacity: visible ? 1 : 0,
              transition: 'all 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 'clamp(1.2rem, 2.5vw, 2.2rem)',
                color: '#d2ff00',
                marginBottom: '0.75rem',
                textShadow: '0 0 40px rgba(210,255,0,0.15)',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              Shut up and take my money
            </span>
            <div style={{ position: 'relative', width: '100%', borderRadius: 12, overflow: 'hidden' }}>
              <img
                src="/images/Shut%20Up%20and%20Take%20My%20Money%20Meme.png"
                alt="Shut up and take my money meme"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top right, #050505 0%, #050505 8%, transparent 55%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {data.pricing.map((plan, i) => (
            <PricingCard key={plan.title} plan={plan} index={i} />
          ))}
        </div>

        <p
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginTop: '3rem',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          We use AI to accelerate development, keeping your costs low. A portion covers the AI tokens used;
          the rest goes into senior developer time, architecture, and quality assurance.
        </p>
      </div>
    </section>
  )
}
