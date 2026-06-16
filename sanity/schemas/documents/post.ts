import { defineArrayMember, defineField, defineType } from 'sanity'

const CATEGORIES = [
  { title: 'Client Stories', value: 'stories' },
  { title: 'Coaching & Retention', value: 'retention' },
  { title: 'Training', value: 'training' },
  { title: 'Business', value: 'business' },
  { title: 'Product Updates', value: 'product' },
]

/**
 * Blog post. Not localized for now — content is English on all locales (the page
 * chrome is localized via next-intl). The `category` value drives the cover
 * gradient/icon in code (see src/components/blog/categories.tsx).
 */
export const post = defineType({
  name: 'post',
  title: 'Blog Post',
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
    defineField({ name: 'excerpt', type: 'text', rows: 3, validation: (R) => R.required() }),
    defineField({ name: 'lead', type: 'text', rows: 3, description: 'Longer dek shown on the article head.' }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (R) => R.required() }),
    defineField({ name: 'readMin', title: 'Read time (min)', type: 'number', initialValue: 5, validation: (R) => R.required().min(1) }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false, description: 'Show as the large hero on the blog index.' }),
    defineField({ name: 'pick', title: "Editor's pick", type: 'boolean', initialValue: false, description: 'Show in the picks rail next to the featured post.' }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
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
            { title: 'Quote', value: 'blockquote' },
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
        defineArrayMember({ type: 'callout' }),
        defineArrayMember({ type: 'pullquote' }),
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
      title: 'Published, newest first',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', category: 'category', media: 'coverImage' },
    prepare: ({ title, category, media }) => ({ title, subtitle: category, media }),
  },
})
