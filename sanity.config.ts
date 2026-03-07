import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { heritageLocationSchema } from './schemas/heritageLocation';
import { eventSchema } from './schemas/event';
import { ancestorSchema } from './schemas/ancestor';

export default defineConfig({
  name:    'kuvala-heritage',
  title:   'Kuvala Heritage CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

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
