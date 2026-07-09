import type { LegalDoc } from '@/lib/legal'

export const TERMS_DOC: LegalDoc = {
  slug: 'terms',
  title: 'Terms of Service',
  lastUpdated: '2026-02-09',
  sections: [
    {
      n: 1,
      heading: 'Acceptance of Terms',
      id: 'acceptance-of-terms',
      blocks: [
        {
          type: 'p',
          text: "By accessing Jimmy's website, mobile application, or related services, you consent to be bound by these Terms. If you disagree, you cannot use the Service. These Terms constitute a legally binding agreement between you and Just Jimmy LLC, a company incorporated in the United States.",
        },
      ],
    },
    {
      n: 2,
      heading: 'Definitions',
      id: 'definitions',
      blocks: [
        {
          type: 'ul',
          items: [
            'User or You: any individual accessing the Service',
            'Coach: fitness professional managing clients via the Service',
            'Client: individual receiving coaching through the Service',
            'Account: registered account for Service access',
            'Content: text, data, information, workout plans, videos, photos, or materials',
          ],
        },
      ],
    },
    {
      n: 3,
      heading: 'Eligibility',
      id: 'eligibility',
      blocks: [
        {
          type: 'p',
          text: "Users must be at least 16 years old. Those under 18 need parental/guardian permission. By using the Service, you represent that you possess legal capacity and aren't prohibited by law from using it.",
        },
      ],
    },
    {
      n: 4,
      heading: 'Account Registration',
      id: 'account-registration',
      blocks: [
        { type: 'h3', text: '4.1 Creating an Account' },
        {
          type: 'p',
          text: 'To access features, you must provide a valid email, secure password, and basic profile information including your role as Coach or Client.',
        },
        { type: 'h3', text: '4.2 Account Security' },
        {
          type: 'p',
          text: "You're responsible for maintaining credential confidentiality, all Account activities, and immediately notifying the company of unauthorized use at hello@jimmycoach.com. The company isn't liable for losses from inadequate Account protection.",
        },
      ],
    },
    {
      n: 5,
      heading: 'Service Description',
      id: 'service-description',
      blocks: [
        { type: 'h3', text: '5.1 Current Phase (Waitlist)' },
        {
          type: 'p',
          text: 'During the Waitlist phase, you may register interest with progressive platform access granted.',
        },
        { type: 'h3', text: '5.2 Full Service (Upon Launch)' },
        {
          type: 'p',
          text: 'Coaches access tools for creating workout plans, tracking progress, communicating with clients, and managing subscriptions. Clients receive personalized plans, progress tracking, and Coach communication.',
        },
        { type: 'h3', text: '5.3 Service Availability' },
        {
          type: 'p',
          text: 'We strive to provide continuous service availability but do not guarantee uninterrupted or error-free operation. The company may suspend services, perform maintenance, or modify features.',
        },
      ],
    },
    {
      n: 6,
      heading: 'Subscription and Payment Terms',
      id: 'subscription-and-payment-terms',
      blocks: [
        { type: 'h3', text: '6.1 Free Trial (If Applicable)' },
        {
          type: 'p',
          text: 'Free trials automatically convert to paid plans unless canceled.',
        },
        { type: 'h3', text: '6.2 Subscription Plans' },
        {
          type: 'p',
          text: "Coach Plans offer monthly or annual subscriptions. Client access is determined by the Coach's subscription tier.",
        },
        { type: 'h3', text: '6.3 Billing' },
        {
          type: 'p',
          text: 'Subscriptions are billed in advance on monthly or annual bases through secure third-party processors. You authorize charging your payment method.',
        },
        { type: 'h3', text: '6.4 Price Changes' },
        {
          type: 'p',
          text: "We reserve the right to change our pricing. We will provide at least 30 days' notice before any price increase takes effect. Continued use constitutes acceptance.",
        },
        { type: 'h3', text: '6.5 Refund Policy' },
        {
          type: 'p',
          text: "You may cancel anytime; cancellation takes effect at the current billing period's end. We do not provide refunds for partial months or unused portions of a subscription, except as required by law.",
        },
      ],
    },
    {
      n: 7,
      heading: 'License and Restrictions',
      id: 'license-and-restrictions',
      blocks: [
        { type: 'h3', text: '7.1 Limited License' },
        {
          type: 'p',
          text: 'Subject to these Terms, Jimmy grants a limited, non-exclusive, non-transferable, revocable license for personal or business use.',
        },
        { type: 'h3', text: '7.2 Restrictions' },
        {
          type: 'p',
          text: 'You cannot copy, modify, or create derivative works; reverse engineer or decompile; rent, lease, sell, or sublicense; use illegally; upload malware; harass users; impersonate others; or scrape data without permission.',
        },
      ],
    },
    {
      n: 8,
      heading: 'User Content and Data',
      id: 'user-content-and-data',
      blocks: [
        { type: 'h3', text: '8.1 Your Content' },
        {
          type: 'p',
          text: 'You retain ownership of uploaded Content. By uploading, you grant a worldwide, non-exclusive, royalty-free license to store, process, display, and share your Content with applicable Coaches or Clients.',
        },
        { type: 'h3', text: '8.2 Content Responsibility' },
        {
          type: 'p',
          text: "You're solely responsible for Content accuracy, legality, and obtaining necessary permissions for materials like music or images.",
        },
        { type: 'h3', text: '8.3 Prohibited Content' },
        {
          type: 'p',
          text: "You cannot upload illegal, obscene, defamatory, or infringing content; materials containing viruses; or content violating others' privacy or rights.",
        },
        { type: 'h3', text: '8.4 Content Removal' },
        {
          type: 'p',
          text: 'Jimmy reserves the right to remove violating Content without notice.',
        },
      ],
    },
    {
      n: 9,
      heading: 'Health and Fitness Disclaimer',
      id: 'health-and-fitness-disclaimer',
      blocks: [
        { type: 'h3', text: '9.1 Not Medical Advice' },
        {
          type: 'p',
          text: 'The Service is designed for general fitness and wellness purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Consult qualified healthcare providers before starting fitness programs; seek medical attention for chest pain, dizziness, or exercise discomfort.',
        },
        { type: 'h3', text: '9.2 Assumption of Risk' },
        {
          type: 'p',
          text: "Physical exercise carries inherent risks, including risk of injury or death. You voluntarily participate at your own risk; the company isn't responsible for resulting injuries, illness, or damages.",
        },
        { type: 'h3', text: '9.3 Coach Qualifications' },
        {
          type: 'p',
          text: "The company doesn't verify Coach credentials. Clients must verify their Coach's qualifications and suitability independently.",
        },
      ],
    },
    {
      n: 10,
      heading: 'Intellectual Property Rights',
      id: 'intellectual-property-rights',
      blocks: [
        { type: 'h3', text: '10.1 Our Property' },
        {
          type: 'p',
          text: 'The Service, original content (excluding User Content), features, and functionality are owned by Jimmy and protected by copyright, trademark, patent, trade secret, and intellectual property laws.',
        },
        { type: 'h3', text: '10.2 Trademarks' },
        {
          type: 'p',
          text: "Jimmy, Jimmy Coach, and related logos are Jimmy's trademarks and cannot be used without written permission.",
        },
      ],
    },
    {
      n: 11,
      heading: 'Third-Party Services',
      id: 'third-party-services',
      blocks: [
        {
          type: 'p',
          text: 'The Service may contain third-party links not owned or controlled by Jimmy. We are not responsible for the content, privacy policies, or practices of third-party services.',
        },
      ],
    },
    {
      n: 12,
      heading: 'Termination',
      id: 'termination',
      blocks: [
        { type: 'h3', text: '12.1 Termination by You' },
        {
          type: 'p',
          text: 'You may terminate by accessing Account Settings and selecting Delete Account or contacting hello@jimmycoach.com.',
        },
        { type: 'h3', text: '12.2 Termination by Us' },
        {
          type: 'p',
          text: 'Jimmy may immediately suspend or terminate your Account without notice for breaching Terms, engaging in fraudulent activity, or disrupting other users or the platform.',
        },
        { type: 'h3', text: '12.3 Effect of Termination' },
        {
          type: 'p',
          text: 'Your Service access ceases immediately. Jimmy may delete your Account and Content subject to data retention legal obligations. You remain liable for outstanding fees.',
        },
      ],
    },
    {
      n: 13,
      heading: 'Disclaimers',
      id: 'disclaimers',
      blocks: [
        {
          type: 'p',
          text: 'THE SERVICE IS PROVIDED \'AS IS\' AND \'AS AVAILABLE\' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. The company doesn\'t warrant that the Service meets your requirements, errors will be corrected, or the Service is virus-free.',
        },
      ],
    },
    {
      n: 14,
      heading: 'Limitation of Liability',
      id: 'limitation-of-liability',
      blocks: [
        { type: 'h3', text: '14.1 Exclusion of Damages' },
        {
          type: 'p',
          text: "Jimmy isn't liable for indirect, incidental, special, consequential, or punitive damages; lost profits, revenue, data, or business opportunities; or personal injury or death from Service use.",
        },
        { type: 'h3', text: '14.2 Cap on Liability' },
        {
          type: 'p',
          text: 'Total liability shall not exceed the greater of amounts paid in the preceding 12 months or $100 USD.',
        },
        { type: 'h3', text: '14.3 Exceptions' },
        {
          type: 'p',
          text: "Some jurisdictions don't permit excluding certain warranties or liabilities, so these limitations may not apply in those areas.",
        },
      ],
    },
    {
      n: 15,
      heading: 'Indemnification',
      id: 'indemnification',
      blocks: [
        {
          type: 'p',
          text: 'You indemnify Jimmy, its affiliates, officers, directors, employees, and agents from claims, damages, losses, liabilities, costs, or expenses (including attorney fees) arising from your Service use, Term violations, third-party rights violations, or your Content.',
        },
      ],
    },
    {
      n: 16,
      heading: 'Dispute Resolution and Governing Law',
      id: 'dispute-resolution-and-governing-law',
      blocks: [
        { type: 'h3', text: '16.1 Governing Law' },
        {
          type: 'p',
          text: 'These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles.',
        },
        { type: 'h3', text: '16.2 For Users Outside the United States' },
        {
          type: 'p',
          text: 'EU and UK consumer protections remain unaffected by these Terms.',
        },
        { type: 'h3', text: '16.3 Jurisdiction' },
        {
          type: 'p',
          text: 'Disputes are resolved in Delaware state or federal courts with exclusive jurisdiction.',
        },
        { type: 'h3', text: '16.4 Arbitration (Optional - For US Users)' },
        {
          type: 'p',
          text: 'Binding arbitration may be offered to US-based users as an alternative to litigation.',
        },
      ],
    },
    {
      n: 17,
      heading: 'Changes to These Terms',
      id: 'changes-to-these-terms',
      blocks: [
        {
          type: 'p',
          text: 'Jimmy may modify these Terms anytime. Material changes include posting updated Terms with a new date and email notification. Continued use constitutes acceptance.',
        },
      ],
    },
    {
      n: 18,
      heading: 'General Provisions',
      id: 'general-provisions',
      blocks: [
        { type: 'h3', text: '18.1 Entire Agreement' },
        {
          type: 'p',
          text: 'These Terms constitute the entire agreement between you and Jimmy regarding the Service.',
        },
        { type: 'h3', text: '18.2 Severability' },
        {
          type: 'p',
          text: 'If any provision is unenforceable, remaining provisions remain fully effective.',
        },
        { type: 'h3', text: '18.3 Waiver' },
        {
          type: 'p',
          text: "Failure to enforce Terms provisions doesn't constitute a waiver of those rights.",
        },
        { type: 'h3', text: '18.4 Assignment' },
        {
          type: 'p',
          text: 'You cannot assign or transfer these Terms without written consent; Jimmy may assign without restriction.',
        },
        { type: 'h3', text: '18.5 Force Majeure' },
        {
          type: 'p',
          text: "Jimmy isn't liable for failures or delays caused by circumstances beyond reasonable control, such as natural disasters, war, or pandemics.",
        },
      ],
    },
    {
      n: 19,
      heading: 'Contact Us',
      id: 'contact-us',
      blocks: [
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
