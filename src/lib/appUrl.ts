/**
 * Absolute URLs into the Jimmy web app (app.jimmycoach.com).
 * Kept absolute on purpose: the marketing site and the app are separate
 * deployments, and absolute URLs bypass next-intl's locale prefixing.
 */
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.jimmycoach.com'

export const appLoginUrl = `${APP_URL}/login`
export const appRegisterUrl = `${APP_URL}/register`
