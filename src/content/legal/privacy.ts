import type { LegalDoc } from '@/lib/legal'

export const PRIVACY_DOC: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy Policy',
  lastUpdated: '2026-02-09',
  sections: [
    {
      n: 1,
      heading: 'Introduction',
      id: 'introduction',
      blocks: [
        {
          type: 'p',
          text: 'Welcome to Just Jimmy LLC ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website jimmycoach.com (the "Site"), use our mobile application ("App"), and engage with our coaching services. Important Note for EU Users: While Just Jimmy LLC is a company based in the United States, we highly value your privacy. We have chosen to host our primary databases and user data on secure servers located in Frankfurt, Germany (EU) to ensure maximum protection under European standards.',
        },
      ],
    },
    {
      n: 2,
      heading: 'Information We Collect',
      id: 'information-we-collect',
      blocks: [
        { type: 'h3', text: 'A. Personal Data You Provide to Us' },
        {
          type: 'p',
          text: 'We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.',
        },
        {
          type: 'ul',
          items: [
            'Identity Data: Name, username, or similar identifier.',
            'Contact Data: Email address (used for waitlist, login, and communication).',
            'Profile Data: Your password, preferences, feedback, and survey responses.',
          ],
        },
        { type: 'h3', text: 'B. Sensitive Personal Data (Health Data)' },
        {
          type: 'p',
          text: 'When you use our Mobile App or Web Platform to track workouts, body metrics (weight, height, body fat %), nutrition logs, or progress photos, we process data concerning your health ("Health Data").',
        },
        {
          type: 'ul',
          items: [
            'Legal Basis: We process this data ONLY based on your explicit consent (Article 9(2)(a) GDPR), which you provide when you start using the tracking features. You can withdraw this consent at any time by deleting your account or data.',
          ],
        },
        { type: 'h3', text: 'C. Information Automatically Collected' },
        {
          type: 'p',
          text: 'When you visit our Site or App, our servers automatically collect certain technical information, including:',
        },
        {
          type: 'ul',
          items: [
            'Log and Usage Data: IP address, browser type, device settings, operating system, and crash data.',
            'Cookies and Tracking Technologies: We may use cookies (like Google Analytics 4 and Meta Pixel) to access or store information. Specific details are set out in our Cookie Policy.',
          ],
        },
      ],
    },
    {
      n: 3,
      heading: 'How We Use Your Information',
      id: 'how-we-use-your-information',
      blocks: [
        {
          type: 'p',
          text: 'We use the information we collect or receive:',
        },
        {
          type: 'ul',
          items: [
            'To provide the Service: To create your account, track your fitness progress, and deliver coaching content.',
            'To manage the Waitlist: To send you updates about our launch and grant you access when ready.',
            'To send administrative information: Changes to our terms, conditions, and policies.',
            'To protect our Services: For fraud monitoring and prevention.',
            'For Marketing (with your consent): To send you promotional emails via Mailchimp. You can opt-out at any time.',
          ],
        },
      ],
    },
    {
      n: 4,
      heading: 'How We Share Your Information',
      id: 'how-we-share-your-information',
      blocks: [
        {
          type: 'p',
          text: 'We do not sell your personal information. We share information with the following third-party vendors who perform services for us (Data Processors):',
        },
        {
          type: 'table',
          head: ['Provider', 'Service', 'Location of Data', 'Safeguards'],
          rows: [
            ['Supabase', 'Database & Authentication', 'Frankfurt, Germany (EU)', 'DPA + SCCs'],
            ['Mailchimp', 'Email Marketing (Waitlist)', 'United States', 'DPA + SCCs'],
            ['Vercel', 'Web Hosting (Frontend)', 'Global / US', 'DPA + SCCs'],
            ['Google / Meta', 'Analytics & Ads', 'United States', 'Consent-based'],
          ],
        },
      ],
    },
    {
      n: 5,
      heading: 'Data Storage and International Transfers',
      id: 'data-storage-and-international-transfers',
      blocks: [
        { type: 'h3', text: 'Primary Storage Location' },
        {
          type: 'p',
          text: 'We store all user data (including Health Data) on secure servers located in Frankfurt, Germany (EU), provided by our partner Supabase. We have specifically selected this region to ensure that your personal data remains within the European Economic Area (EEA) to the maximum extent possible.',
        },
        { type: 'h3', text: 'Legal Framework for US Transfers' },
        {
          type: 'p',
          text: 'Although our servers are in the EU, Just Jimmy LLC is a company incorporated in the United States. Therefore, we may access your data from the US for technical support, maintenance, or legal purposes. To ensure your data remains protected during such access, we rely on:',
        },
        {
          type: 'ul',
          items: [
            "Standard Contractual Clauses (SCCs): We have signed Data Processing Agreements (DPAs) with our vendors that include the European Commission's Standard Contractual Clauses.",
          ],
        },
      ],
    },
    {
      n: 6,
      heading: 'Security of Your Data',
      id: 'security-of-your-data',
      blocks: [
        {
          type: 'p',
          text: 'We use administrative, technical, and physical security measures to protect your personal information.',
        },
        {
          type: 'ul',
          items: [
            'Encryption: Data is encrypted in transit (SSL/TLS) and at rest.',
            'Access Control: We utilize Row Level Security (RLS) within our database (Supabase) to ensure strict access control, meaning each user can only access their own data.',
            'Server Security: Our data is stored in ISO 27001 certified data centers.',
          ],
        },
      ],
    },
    {
      n: 7,
      heading: 'Your Data Protection Rights (GDPR & CCPA)',
      id: 'your-data-protection-rights',
      blocks: [
        {
          type: 'p',
          text: 'Depending on your location, you may have the following rights:',
        },
        {
          type: 'ol',
          items: [
            'The right to access: Request copies of your personal data.',
            'The right to rectification: Request that we correct any information you believe is inaccurate.',
            'The right to erasure ("Right to be forgotten"): Request that we erase your personal data (e.g., delete your account).',
            'The right to restrict processing: Request that we restrict the processing of your personal data.',
            'The right to withdraw consent: You can unsubscribe from our emails or withdraw consent for health data processing at any time.',
          ],
        },
        {
          type: 'p',
          text: 'To exercise these rights, please contact us at: hello@jimmycoach.com.',
        },
      ],
    },
    {
      n: 8,
      heading: 'Data Retention',
      id: 'data-retention',
      blocks: [
        {
          type: 'p',
          text: 'We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy (e.g., until you delete your account), unless a longer retention period is required by law.',
        },
      ],
    },
    {
      n: 9,
      heading: 'Updates to This Policy',
      id: 'updates-to-this-policy',
      blocks: [
        {
          type: 'p',
          text: 'We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and will be effective as soon as it is accessible.',
        },
      ],
    },
    {
      n: 10,
      heading: 'Contact Us',
      id: 'contact-us',
      blocks: [
        {
          type: 'p',
          text: 'If you have questions or comments about this policy, you may contact us at:',
        },
        {
          type: 'p',
          text: 'Just Jimmy LLC, 800 North King Street, Suite 304, Wilmington, DE 19801, US.',
        },
        {
          type: 'p',
          text: 'Email: legal@jimmycoach.com',
        },
      ],
    },
  ],
}
