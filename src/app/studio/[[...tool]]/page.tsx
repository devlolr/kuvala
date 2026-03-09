
/**
 * Sanity Studio — Embedded in Next.js app at /studio
 *
 * This page renders the full Sanity Studio UI inside a Next.js route.
 * Access it at: http://localhost:3000/studio
 *
 * The [[...tool]] catch-all segment allows Studio's internal routing
 * (e.g. /studio/desk/heritageLocation) to work correctly.
 */

import { StudioBase } from './StudioBase';
export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <StudioBase />;
}
