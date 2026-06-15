import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { FooterData } from '@/lib/content'

/* ── Social icons (inline SVG — no extra deps) ──────────────────── */
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={18} height={18} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.24 8h4.5v14H.24V8zm7.5 0h4.31v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.5v-6.62c0-1.58-.03-3.62-2.2-3.62-2.2 0-2.54 1.72-2.54 3.5V22h-4.5V8z" />
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} aria-hidden="true">
      <path d="M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.39 0 12 0 12s0 3.61.5 5.5a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.61 24 12 24 12s0-3.61-.5-5.5zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
    </svg>
  )
}

function IconDiscord() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} aria-hidden="true">
      <path d="M20.32 4.57A19.8 19.8 0 0 0 15.4 3.04a13.9 13.9 0 0 0-.63 1.29 18.3 18.3 0 0 0-5.49 0 13.9 13.9 0 0 0-.64-1.29A19.8 19.8 0 0 0 3.7 4.57C.57 9.24-.28 13.8.14 18.29a19.95 19.95 0 0 0 6.07 3.06c.49-.67.92-1.38 1.3-2.13-.71-.27-1.39-.6-2.04-.99.17-.13.34-.26.5-.4a14.25 14.25 0 0 0 12.06 0c.16.14.33.27.5.4-.65.39-1.33.72-2.04.99.37.75.81 1.46 1.3 2.13a19.9 19.9 0 0 0 6.07-3.06c.5-5.2-.85-9.72-3.62-13.72zM8.02 15.52c-1.2 0-2.18-1.1-2.18-2.45s.96-2.46 2.18-2.46c1.23 0 2.21 1.11 2.19 2.46 0 1.35-.97 2.45-2.19 2.45zm7.96 0c-1.2 0-2.18-1.1-2.18-2.45s.96-2.46 2.18-2.46c1.23 0 2.21 1.11 2.19 2.46 0 1.35-.96 2.45-2.19 2.45z" />
    </svg>
  )
}

const SOCIAL = [
  { href: '#', label: 'Instagram', icon: <IconInstagram /> },
  { href: '#', label: 'LinkedIn', icon: <IconLinkedIn /> },
  { href: '#', label: 'YouTube', icon: <IconYouTube /> },
  { href: '#', label: 'Discord', icon: <IconDiscord /> },
]

/* Internal ("/…") hrefs use the locale-aware Link; anchors/externals stay <a>. */
function FtLink({
  link,
}: {
  link: { label?: string | null; href?: string | null; external?: boolean | null }
}) {
  const href = link.href ?? '#'
  if (href.startsWith('/') && !link.external) {
    return (
      <Link href={href} className="ft-col-link">
        {link.label}
      </Link>
    )
  }
  return (
    <a href={href} className="ft-col-link">
      {link.label}
    </a>
  )
}

/* ── Footer ──────────────────────────────────────────────────────── */
export function Footer({ data }: { data: FooterData }) {
  return (
    <>
      {/*
        Scoped CSS block — server-safe; declares custom vars and hover rules
        that cannot be expressed via Tailwind utilities alone (custom-prop colors).
      */}
      <style>{`
        .ft-root {
          --ft-bg:       #15110D;
          --ft-text:     #F6F3EE;
          --ft-muted:    rgba(246,243,238,0.56);
          --ft-faint:    rgba(246,243,238,0.34);
          --ft-line:     rgba(246,243,238,0.10);
          --ft-lime:     #B985F5;
          --ft-lime-soft: rgba(138,50,224,0.18);
        }
        .ft-col-link {
          display: inline-block;
          width: fit-content;
          font-size: 15px;
          font-weight: 450;
          line-height: 1.5;
          color: var(--ft-muted);
          text-decoration: none;
          padding: 6px 0;
          transition: color 180ms ease, transform 180ms ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .ft-col-link:hover { color: var(--ft-text); transform: translateX(3px); }
        }
        .ft-social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          border-radius: 50%;
          color: var(--ft-muted);
          border: 1px solid var(--ft-line);
          background: rgba(246,243,238,0.02);
          transition: color 180ms ease, border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .ft-social-link:hover {
            color: var(--ft-lime);
            border-color: rgba(138,50,224,0.45);
            background: var(--ft-lime-soft);
            transform: translateY(-2px);
          }
        }
        .ft-top {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: clamp(2rem, 5vw, 4.5rem);
        }
        @media (max-width: 880px) {
          .ft-top { grid-template-columns: 1fr 1fr; gap: 2.5rem 2rem; }
          .ft-brand { grid-column: 1 / -1; max-width: none !important; }
        }
        @media (max-width: 520px) {
          .ft-top { grid-template-columns: 1fr; gap: 2.25rem; }
          .ft-bottom { flex-direction: column !important; align-items: center !important; text-align: center; gap: 22px !important; }
        }
      `}</style>

      <footer
        className="ft-root relative isolate overflow-hidden"
        style={{
          background: 'var(--ft-bg)',
          color: 'var(--ft-text)',
          paddingBlock: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1.75rem, 3vw, 2.25rem)',
          paddingInline: 'clamp(1.25rem, 5vw, 3rem)',
        }}
      >
        {/* Background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            opacity: 0.6,
            background: `
              radial-gradient(40% 60% at 100% 0%, rgba(138,50,224,0.12) 0%, transparent 60%),
              radial-gradient(46% 70% at 0% 100%, rgba(138,50,224,0.08) 0%, transparent 62%)
            `,
          }}
        />

        <div style={{ maxWidth: '1180px', marginInline: 'auto' }}>

          {/* Top grid */}
          <div className="ft-top">

            {/* Brand block */}
            <div className="ft-brand flex flex-col items-start" style={{ maxWidth: '300px' }}>
              <Link href="/" aria-label="Jimmy Coach" className="inline-flex items-center gap-[11px]">
                <Image
                  src="/assets/logo/logo.svg"
                  alt=""
                  width={34}
                  height={34}
                  className="rounded-[9px] flex-shrink-0"
                />
                <span
                  className="font-display font-extrabold leading-none tracking-[-0.04em]"
                  style={{ fontSize: '22px', color: 'var(--ft-text)' }}
                >
                  Jimmy
                </span>
              </Link>
              <p
                className="font-display font-bold leading-[1.1] tracking-[-0.03em]"
                style={{
                  marginTop: '22px',
                  fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                  color: 'var(--ft-text)',
                }}
              >
                {data.taglinePrefix}
                <em style={{ fontStyle: 'normal', color: 'var(--ft-lime)' }}>{data.taglineEmphasis}</em>
              </p>
            </div>

            {/* Product col */}
            <nav aria-label={data.productHeading ?? ''} className="flex flex-col">
              <h4
                className="font-body font-bold uppercase tracking-[0.15em]"
                style={{ fontSize: '12px', color: 'var(--ft-faint)', marginBottom: '18px' }}
              >
                {data.productHeading}
              </h4>
              {(data.productLinks ?? []).map((link, i) => (
                <FtLink key={i} link={link} />
              ))}
            </nav>

            {/* Company col */}
            <nav aria-label={data.companyHeading ?? ''} className="flex flex-col">
              <h4
                className="font-body font-bold uppercase tracking-[0.15em]"
                style={{ fontSize: '12px', color: 'var(--ft-faint)', marginBottom: '18px' }}
              >
                {data.companyHeading}
              </h4>
              {(data.companyLinks ?? []).map((link, i) => (
                <FtLink key={i} link={link} />
              ))}
            </nav>

            {/* Legal col */}
            <nav aria-label={data.legalHeading ?? ''} className="flex flex-col">
              <h4
                className="font-body font-bold uppercase tracking-[0.15em]"
                style={{ fontSize: '12px', color: 'var(--ft-faint)', marginBottom: '18px' }}
              >
                {data.legalHeading}
              </h4>
              {(data.legalLinks ?? []).map((link, i) => (
                <FtLink key={i} link={link} />
              ))}
            </nav>
          </div>

          {/* Bottom bar */}
          <div
            className="ft-bottom flex flex-wrap items-center justify-between gap-5"
            style={{
              marginTop: 'clamp(2.5rem, 5vw, 4rem)',
              paddingTop: 'clamp(1.5rem, 2.5vw, 2rem)',
              borderTop: '1px solid var(--ft-line)',
            }}
          >
            <p style={{ fontSize: '13.5px', fontWeight: 450, color: 'var(--ft-faint)', letterSpacing: '-0.005em' }}>
              {data.copy}
            </p>

            <div className="flex items-center gap-[10px]">
              {SOCIAL.map(({ href, label, icon }) => (
                <a key={label} href={href} aria-label={label} className="ft-social-link">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
