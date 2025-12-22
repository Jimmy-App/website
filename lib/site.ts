export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return "http://localhost:3000";
  }

  return siteUrl.replace(/\/$/, "");
}
