/**
 * Renders one or more JSON-LD schema objects into a <script> tag. Server
 * component. `<` is escaped so structured data can't break out of the script.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[]
}) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
