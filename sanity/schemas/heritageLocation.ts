import { defineType, defineField } from 'sanity';

/**
 * Heritage Location — covers all types:
 * Temples, Devasthans, Chabutro, Panjrapole, and future additions.
 */
export const heritageLocationSchema = defineType({
  name:  'heritageLocation',
  title: 'Heritage Location',
  type:  'document',
  fields: [
    defineField({
      name:        'title',
      title:       'Name',
      type:        'string',
      description: 'e.g. Shiva Temple, Chabutro Bird Tower',
      validation:  (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name:        'titleGu',
      title:       'Name (Gujarati)',
      type:        'string',
      description: 'Gujarati translation of the name',
    }),
    defineField({
      name:        'slug',
      title:       'URL Slug',
      type:        'slug',
      options:     { source: 'title' },
      validation:  (Rule) => Rule.required(),
    }),
    defineField({
      name:        'category',
      title:       'Category',
      type:        'string',
      options:     {
        list: [
          { title: 'Temple',     value: 'temple'     },
          { title: 'Devasthan',  value: 'devasthan'  },
          { title: 'Chabutro',   value: 'chabutro'   },
          { title: 'Panjrapole', value: 'panjrapole' },
          { title: 'Other',      value: 'other'      },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:   'deity',
      title:  'Deity / Presiding Name',
      type:   'string',
      description: 'For temples only — e.g. Lord Shiva, Hanuman',
      hidden: ({ document }) => document?.category !== 'temple',
    }),
    defineField({
      name:   'foundedYear',
      title:  'Approximate Year Founded',
      type:   'string',
      description: 'e.g. 1680 or "Early 18th century"',
    }),
    defineField({
      name:  'managingTrust',
      title: 'Managing Trust / Family',
      type:  'string',
    }),
    defineField({
      name:  'location',
      title: 'Physical Location Description',
      type:  'string',
      description: 'e.g. "North end of Kuvala village square"',
    }),
    defineField({
      name:  'excerpt',
      title: 'Short Description',
      type:  'text',
      rows:  2,
      description: 'Used on the Locations index card (max 200 chars)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name:  'description',
      title: 'Full Overview',
      type:  'array',
      of:    [{ type: 'block' }],
    }),
    defineField({
      name:  'history',
      title: 'History',
      type:  'array',
      of:    [{ type: 'block' }],
    }),
    defineField({
      name:    'image',
      title:   'Main Image',
      type:    'image',
      options: { hotspot: true },
      fields:  [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name:  'gallery',
      title: 'Image Gallery',
      type:  'array',
      of:    [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      description: 'Check to highlight this location on the site homepage',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', subtitle: 'category' },
  },
});
