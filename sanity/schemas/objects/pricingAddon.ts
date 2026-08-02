import { defineField, defineType } from 'sanity'

export const pricingAddon = defineType({
  name: 'pricingAddon',
  type: 'object',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'price', type: 'string' }),
    // Same three states as features (JIM-145) — an add-on nobody can buy yet
    // is a promise and has to say so.
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Live — on sale, no badge', value: 'live' },
          { title: 'In beta — badge', value: 'beta' },
          { title: 'Coming soon — badge', value: 'soon' },
        ],
        layout: 'radio',
      },
      initialValue: 'live',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price', status: 'status' },
    prepare: ({ title, subtitle, status }) => ({
      title: status && status !== 'live' ? `${title} · ${status}` : title,
      subtitle,
    }),
  },
})
