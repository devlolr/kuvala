export { metadata, viewport } from 'next-sanity/studio';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
