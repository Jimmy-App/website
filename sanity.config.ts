// Root-level re-export so that `sanity schema extract` can find the studio config.
// The actual config lives at sanity/sanity.config.ts (embedded Next.js studio pattern).
export { default } from './sanity/sanity.config'
