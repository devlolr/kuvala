import { defineType, defineField } from 'sanity';

export const ancestorSchema = defineType({
  name:  'ancestor',
  title: 'Ancestor / Heritage Node',
  type:  'document',
  description: 'Represents a person, event, or monument in the Legacy Mind-Map',
  fields: [
    defineField({ name: 'name', title: 'Name / Title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'era', title: 'Era / Period', type: 'string',
      description: 'e.g. "17th Century", "Modern Era"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'nodeType', title: 'Node Type', type: 'string',
      options: { list: [
        { title: 'Ancestor',   value: 'ancestor'   },
        { title: 'Event',      value: 'event'       },
        { title: 'Monument',   value: 'monument'   },
        { title: 'Temple',     value: 'temple'      },
        { title: 'Devasthan',  value: 'devasthan'  },
        { title: 'Chabutro',   value: 'chabutro'   },
        { title: 'Panjrapole', value: 'panjrapole' },
      ], layout: 'radio' },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'role', title: 'Role / Designation', type: 'string' }),
    defineField({
      name: 'parent', title: 'Parent Node (hierarchical)',
      type: 'reference', to: [{ type: 'ancestor' }],
      description: 'The direct ancestor or parent event this node descends from',
    }),
    defineField({ name: 'bio', title: 'Biography / Description', type: 'text', rows: 4 }),
  ],
  preview: { select: { title: 'name', subtitle: 'era' } },
});
