import { defineField, defineType } from 'sanity'

/** Video skeleton / embed block inside a guide body. */
export const guideVideo = defineType({
  name: 'guideVideo',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', title: 'Label', validation: (R) => R.required() }),
    defineField({ name: 'duration', type: 'string', title: 'Duration (e.g. "2:08")' }),
    defineField({ name: 'url', type: 'url', title: 'Video URL (optional)' }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'duration' },
  },
})
