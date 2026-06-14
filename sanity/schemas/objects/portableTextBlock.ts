import { defineType } from 'sanity'

export const portableTextBlock = defineType({
  name: 'portableTextBlock',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
      },
    },
  ],
})
