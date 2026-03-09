import type { Metadata } from 'next';
import { Suspense } from 'react';
import { sanityFetch } from '@/lib/sanity/client';
import { UPCOMING_EVENTS_QUERY } from '@/lib/sanity/queries';
import EventCard from '@/components/events/EventCard';
import RegistrationForm from '@/components/events/RegistrationForm';
import EmptyState from '@/components/ui/EmptyState';
import type { SanityEvent } from '@/components/events/EventCard';

export const metadata: Metadata = {
  title: 'Events & Registration',
  description: "Join Kuvala's upcoming celebrations, festivals, and community gatherings. Register online.",
};

export const revalidate = 1800; // 30 min

export default async function EventsPage() {
  const today  = new Date().toISOString().split('T')[0];
  const events = await sanityFetch<SanityEvent[]>(UPCOMING_EVENTS_QUERY, { today });

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <EmptyState
          title="The Festival Drums are Quiet..."
          message="No upcoming events are scheduled at the moment. Our community elders are planning the next gathering — stay tuned!"
          actionLabel="Explore Heritage"
          actionHref="/locations"
        />
      </div>
    );
  }

  const featuredEvent = events[0];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="gradient-mesh py-16 text-center">
        <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
          Community Gatherings
        </p>
        <h1 className="font-display text-5xl-fluid font-bold text-ivory mb-4">
          Events & Festivals
        </h1>
        <p className="text-parchment/70 text-lg max-w-xl mx-auto">
          Celebrate with us. Register for upcoming events in Kuvala.
        </p>
      </div>

      <div className="container-wide section-pad">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events list */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="font-display text-earth text-2xl-fluid font-bold">
              Upcoming Events
            </h2>
            <Suspense fallback={<p className="text-stone">Loading events…</p>}>
              <div className="flex flex-col gap-4">
                {events.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </Suspense>
          </div>

          {/* Registration sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 card-heritage p-6">
              <h2 className="font-display text-earth text-xl font-bold mb-1">
                Register Now
              </h2>
              {featuredEvent && (
                <p className="text-stone text-sm mb-6">
                  Registering for: <span className="text-terracotta font-semibold">{featuredEvent.title}</span>
                </p>
              )}
              <RegistrationForm
                eventId={featuredEvent?._id ?? 'general'}
                eventName={featuredEvent?.title ?? 'Kuvala Events'}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
