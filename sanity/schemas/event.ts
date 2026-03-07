import { defineType, defineField } from 'sanity';

export const eventSchema = defineType({
  name:  'event',
  title: 'Event',
  type:  'document',
  fields: [
    defineField({ name: 'title', title: 'Event Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'titleGu', title: 'Title (Gujarati)', type: 'string' }),
    defineField({ name: 'slug', title: 'URL Slug', type: 'slug', options: { source: 'title' }, validation: (R) => R.required() }),
    defineField({ name: 'date', title: 'Event Date', type: 'date', validation: (R) => R.required() }),
    defineField({ name: 'location', title: 'Location', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'capacity', title: 'Capacity (number of attendees)', type: 'number' }),
    defineField({ name: 'excerpt', title: 'Short Description', type: 'text', rows: 2, validation: (R) => R.max(200) }),
    defineField({ name: 'description', title: 'Full Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'image', title: 'Event Banner', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'title', subtitle: 'date', media: 'image' } },
});
