import { defineField, defineType } from 'sanity'

export const pricingAddon = defineType({
  name: 'pricingAddon',
  type: 'object',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'price', type: 'string' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price' },
  },
})
