import { defineField, defineType } from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      type: 'string',
      options: {
        list: ['twitter', 'instagram', 'facebook', 'linkedin', 'youtube', 'tiktok'],
      },
    }),
    defineField({ name: 'url', type: 'url' }),
  ],
  preview: {
    select: { title: 'platform', subtitle: 'url' },
  },
})
