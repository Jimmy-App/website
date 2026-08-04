import type { LegalDoc } from '@/lib/legal'

/**
 * Public account-deletion page. Required by Google Play's account-deletion
 * policy: the URL must be reachable without signing in and without installing
 * the app, and must state what is erased, what is kept, and for how long.
 *
 * Deletion itself happens in the app / web dashboard — this page documents it.
 * Keep it in sync with supabase/functions/request-account-deletion and
 * process-scheduled-deletions in jimmy-web-app.
 */
export const ACCOUNT_DELETION_DOC: LegalDoc = {
  slug: 'account-deletion',
  title: 'Account Deletion',
  lastUpdated: '2026-08-04',
  sections: [
    {
      n: 1,
      heading: 'Overview',
      id: 'overview',
      blocks: [
        {
          type: 'p',
          text: 'This page explains how to delete your Jimmy account (Just Jimmy LLC) and everything stored with it. It applies to the Jimmy mobile app for iOS and Android and to the Jimmy web platform at app.jimmycoach.com.',
        },
        {
          type: 'p',
          text: 'You can start the deletion yourself from inside the app or the web dashboard — you do not need to contact us. If you can no longer sign in, see "If you cannot sign in" below.',
        },
      ],
    },
    {
      n: 2,
      heading: 'Delete from the mobile app',
      id: 'delete-from-the-app',
      blocks: [
        {
          type: 'ol',
          items: [
            'Open the Jimmy app and sign in.',
            'Go to Settings.',
            'Scroll to the bottom and tap "Delete account".',
            'Read the warning and confirm twice.',
            'You are signed out immediately, and we email you a confirmation with a cancellation link.',
          ],
        },
      ],
    },
    {
      n: 3,
      heading: 'Delete from the web platform',
      id: 'delete-from-the-web',
      blocks: [
        {
          type: 'ol',
          items: [
            'Sign in at app.jimmycoach.com.',
            'Open your profile.',
            'In the "Danger zone" section, choose to delete your account.',
            'Confirm the request.',
          ],
        },
        {
          type: 'p',
          text: 'If you own a training space that still has members, contact us before deleting. The space has to be transferred to another coach or closed first, so that your clients do not lose their programs and history without warning.',
        },
      ],
    },
    {
      n: 4,
      heading: 'The 30-day grace period',
      id: 'grace-period',
      blocks: [
        {
          type: 'p',
          text: 'Deleting is not instant. Your account is scheduled for permanent deletion 30 days after you request it, so that a mistaken or unauthorised request can still be undone.',
        },
        {
          type: 'ul',
          items: [
            'During those 30 days your account is inaccessible but recoverable.',
            'Simply signing back in cancels the deletion automatically — nothing is lost.',
            'You can also cancel using the link in the confirmation email we send you.',
            'We send one final reminder 24 hours before the deletion runs.',
            'After the 30 days, the deletion is permanent and cannot be reversed.',
          ],
        },
      ],
    },
    {
      n: 5,
      heading: 'What is deleted',
      id: 'what-is-deleted',
      blocks: [
        {
          type: 'p',
          text: 'When the 30 days end, your login and the data tied to it are erased from our production database:',
        },
        {
          type: 'table',
          head: ['Data', 'What it covers'],
          rows: [
            ['Account and profile', 'Email address, password, name, avatar, language and app preferences'],
            ['Health and body data', 'Weight entries, step counts, activity goals, and any health data synced from Apple Health or Health Connect'],
            ['Training data', 'Workout logs, completed sessions, scheduled workouts, and exercise history'],
            ['Coaching content you created', 'Programs, workouts, exercises and check-in templates you authored as a coach'],
            ['Check-ins', 'Check-in submissions and their answers'],
            ['Memberships', 'Your membership of any training space, and your coach access to spaces'],
            ['Notifications', 'In-app notifications and push notification tokens'],
            ['Marketing contact', 'Your record in our email marketing tool is removed as part of the same process'],
          ],
        },
      ],
    },
    {
      n: 6,
      heading: 'What is kept, and why',
      id: 'what-is-kept',
      blocks: [
        {
          type: 'p',
          text: 'A small amount of data survives deletion, either because the law requires it or because it belongs to somebody else as much as it belongs to you:',
        },
        {
          type: 'table',
          head: ['Data', 'Why', 'How long'],
          rows: [
            [
              'Billing and invoice records',
              'Tax and accounting law. These are held by our payment processor, Stripe, and are not linked to your deleted profile.',
              'As required by law, typically up to 10 years',
            ],
            [
              'Messages you sent in a coaching chat',
              'They are part of the other person\'s conversation history, which we cannot rewrite on your behalf. Your name is removed from them.',
              'Until the other participant deletes their account',
            ],
            [
              'Aggregated, anonymous statistics',
              'Usage counts that can no longer be traced back to you or any individual.',
              'Indefinitely',
            ],
            [
              'Encrypted backups',
              'Backups are kept on a fixed rotation for disaster recovery and are not used to restore deleted accounts.',
              'Up to 30 days after deletion',
            ],
          ],
        },
      ],
    },
    {
      n: 7,
      heading: 'If you cannot sign in',
      id: 'cannot-sign-in',
      blocks: [
        {
          type: 'p',
          text: 'If you no longer have access to the app or to your account, email us from the address you registered with and we will process the deletion for you. Write to legal@jimmycoach.com with the subject "Account deletion".',
        },
        {
          type: 'p',
          text: 'We may ask you to confirm a detail only the account holder would know, so that nobody can delete somebody else\'s account. We respond within 30 days, as required under the GDPR.',
        },
      ],
    },
    {
      n: 8,
      heading: 'Your other rights',
      id: 'your-rights',
      blocks: [
        {
          type: 'p',
          text: 'Deleting your account is one of several rights you have over your data. You can also request a copy of it, correct it, or ask us to restrict how we use it. Our Privacy Policy explains all of them, together with how to reach our team.',
        },
      ],
    },
  ],
}
