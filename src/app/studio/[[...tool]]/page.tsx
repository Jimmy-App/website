import StudioLoader from './StudioLoader'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  const hasStudioConfig = Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET,
  )

  if (!hasStudioConfig) {
    return (
      <section style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Sanity Studio</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{' '}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> in <code>.env.local</code> to
          load the studio.
        </p>
      </section>
    )
  }

  return <StudioLoader />
}
