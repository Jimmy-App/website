import { defineArrayMember, defineField, defineType } from 'sanity'

const CATEGORIES = [
  { title: 'Getting started', value: 'getting-started' },
  { title: 'Your branded app', value: 'branded-app' },
  { title: 'Programming', value: 'programming' },
  { title: 'Community', value: 'community' },
  { title: 'Payments', value: 'payments' },
  { title: 'Clients & retention', value: 'retention' },
]

const LEVELS = [
  { title: 'Beginner', value: 'Beginner' },
  { title: 'Intermediate', value: 'Intermediate' },
  { title: 'Advanced', value: 'Advanced' },
]

/**
 * Help-center guide. Not localized — English content on all locales.
 * The page chrome is localized via next-intl.
 */
export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: CATEGORIES, layout: 'dropdown' },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'level',
      type: 'string',
      options: { list: LEVELS, layout: 'dropdown' },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'readMin',
      title: 'Read time (min)',
      type: 'number',
      validation: (R) => R.required().min(1),
    }),
    defineField({ name: 'updatedAt', title: 'Updated at', type: 'datetime', validation: (R) => R.required() }),
    defineField({ name: 'lead', title: 'Lead / excerpt', type: 'text', rows: 3, description: 'Short summary shown on cards and article header.', validation: (R) => R.required() }),
    defineField({
      name: 'popular',
      type: 'boolean',
      initialValue: false,
      description: 'Show in the "Popular guides" section on the landing page.',
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Sort order within the category (lower = first in sidebar).',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [defineField({ name: 'href', type: 'url', validation: (R) => R.required() })],
              }),
            ],
          },
        }),
        defineArrayMember({ type: 'guideCallout' }),
        defineArrayMember({ type: 'checklist' }),
        defineArrayMember({ type: 'guideSteps' }),
        defineArrayMember({ type: 'guideFaq' }),
        defineArrayMember({ type: 'guideVideo' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  orderings: [
    {
      title: 'Category, then order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'title', category: 'category', level: 'level' },
    prepare: ({ title, category, level }: { title?: string; category?: string; level?: string }) => ({
      title,
      subtitle: `${category ?? '—'} · ${level ?? '—'}`,
    }),
  },
})
