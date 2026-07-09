import type { LegalDoc } from '@/lib/legal'

export const COOKIE_DOC: LegalDoc = {
  slug: 'cookie-policy',
  title: 'Cookie Policy',
  lastUpdated: '2026-02-09',
  sections: [
    {
      n: 1,
      heading: 'Introduction',
      id: 'introduction',
      blocks: [
        {
          type: 'p',
          text: 'This Cookie Policy explains how Just Jimmy LLC (we, our, or us) uses cookies and similar tracking technologies (collectively, Cookies) when you visit jimmycoach.com and use services. This policy should be read alongside the Privacy Policy, which explains how personal information is used.',
        },
      ],
    },
    {
      n: 2,
      heading: 'What are Cookies?',
      id: 'what-are-cookies',
      blocks: [
        {
          type: 'p',
          text: 'Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and to provide information to site owners.',
        },
      ],
    },
    {
      n: 3,
      heading: 'How We Use Cookies',
      id: 'how-we-use-cookies',
      blocks: [
        {
          type: 'p',
          text: 'Cookies are used for the following purposes:',
        },
        {
          type: 'ul',
          items: [
            'Strictly Necessary: To make the website work (e.g., logging in, security)',
            'Analytics: To understand how visitors use the site (e.g., Google Analytics 4)',
            'Marketing: To show relevant ads on other platforms (e.g., Meta/Facebook Pixel)',
          ],
        },
      ],
    },
    {
      n: 4,
      heading: 'Types of Cookies We Use',
      id: 'types-of-cookies-we-use',
      blocks: [
        {
          type: 'p',
          text: 'The company uses both Session Cookies (which expire when you close your browser) and Persistent Cookies (which stay on your device until they expire or you delete them).',
        },
        { type: 'h3', text: 'A. Strictly Necessary Cookies (Always Active)' },
        {
          type: 'p',
          text: 'These cookies are essential for browsing the website and using its features. You cannot switch these off.',
        },
        {
          type: 'table',
          head: ['Cookie Name', 'Provider', 'Purpose', 'Duration'],
          rows: [
            ['sb-access-token', 'Supabase', 'Main authentication token for logging in', 'Session / 1 week'],
            ['sb-refresh-token', 'Supabase', 'Keeps you logged in securely', 'Persistent'],
            ['cookie-consent', 'Jimmy Coach', 'Remembers your Cookie preferences (Accept/Reject)', '1 year'],
            ['__vercel_live_token', 'Vercel', 'Used for real-time deployment updates', 'Session'],
          ],
        },
        { type: 'h3', text: 'B. Analytics Cookies (Requires Consent)' },
        {
          type: 'p',
          text: 'These cookies help understand how you interact with the website by collecting and reporting information anonymously.',
        },
        {
          type: 'table',
          head: ['Cookie Name', 'Provider', 'Purpose', 'Duration'],
          rows: [
            ['_ga', 'Google Analytics 4', 'Distinguishes unique users to count visits', '2 years'],
            ['_ga_XXXXXXXXXX', 'Google Analytics 4', 'Persists session state', '2 years'],
          ],
        },
        { type: 'h3', text: 'C. Marketing Cookies (Requires Consent)' },
        {
          type: 'p',
          text: 'These cookies track your online activity to help advertisers deliver more relevant advertising.',
        },
        {
          type: 'table',
          head: ['Cookie Name', 'Provider', 'Purpose', 'Duration'],
          rows: [
            ['_fbp', 'Meta (Facebook)', 'Stores unique user ID for ad tracking', '3 months'],
            ['_fbc', 'Meta (Facebook)', 'Links ad clicks to website actions (conversions)', '3 months'],
          ],
        },
      ],
    },
    {
      n: 5,
      heading: 'How to Manage Your Cookie Preferences',
      id: 'how-to-manage-your-cookie-preferences',
      blocks: [
        {
          type: 'p',
          text: 'You have the right to decide whether to accept or reject Cookies.',
        },
        { type: 'h3', text: 'On Our Website' },
        {
          type: 'p',
          text: 'You can change your preferences at any time by clicking the Cookie Settings link in the website footer.',
        },
        { type: 'h3', text: 'In Your Browser' },
        {
          type: 'p',
          text: 'Most web browsers allow you to control cookies through their settings preferences. Visit www.allaboutcookies.org for more information about cookies, including how to see what cookies have been set and how to manage and delete them.',
        },
      ],
    },
    {
      n: 6,
      heading: 'Updates to This Policy',
      id: 'updates-to-this-policy',
      blocks: [
        {
          type: 'p',
          text: 'We may update this Cookie Policy from time to time to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this policy regularly to stay informed about cookie usage and related technologies.',
        },
      ],
    },
    {
      n: 7,
      heading: 'Contact Us',
      id: 'contact-us',
      blocks: [
        {
          type: 'p',
          text: 'For questions about cookie usage, email legal@jimmycoach.com.',
        },
      ],
    },
  ],
}
