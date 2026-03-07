import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { heritageLocationSchema } from './sanity/schemas/heritageLocation';
import { eventSchema } from './sanity/schemas/event';
import { ancestorSchema } from './sanity/schemas/ancestor';

export default defineConfig({
  name:    'kuvala-heritage',
  title:   'Kuvala Heritage CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  basePath: '/studio',

  plugins: [
    structureTool(),
    visionTool(), // GROQ query playground — great for development
  ],

  schema: {
    types: [
      heritageLocationSchema,
      eventSchema,
      ancestorSchema,
    ],
  },
});
