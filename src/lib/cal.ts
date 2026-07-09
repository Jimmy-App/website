/**
 * Cal.com "Book a demo" embed config (JIM-49). One booking link, opened as a
 * modal from any element carrying `calTriggerProps`. The <CalInit> component
 * initialises the namespace + theme once per page.
 */
export const CAL_NAMESPACE = 'demo'
export const CAL_LINK = 'jimmycoach/demo'
export const CAL_CONFIG = JSON.stringify({
  layout: 'month_view',
  useSlotsViewOnSmallScreen: 'true',
  theme: 'light',
})

/** Spread onto a button/link to make it open the Cal.com demo modal on click. */
export const calTriggerProps = {
  'data-cal-namespace': CAL_NAMESPACE,
  'data-cal-link': CAL_LINK,
  'data-cal-config': CAL_CONFIG,
} as const
