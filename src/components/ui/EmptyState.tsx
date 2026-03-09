'use client';

import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

/**
 * A light-hearted "Work in Progress" / "Page Broken" component.
 * Used when data is missing or a section is under maintenance.
 */
export default function EmptyState({
  title = "Our Ancestors are still Napping...",
  message = "It looks like the digital scrolls for this section are being carefully restored. Check back soon!",
  actionLabel = "Back to Safety",
  actionHref = "/"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative mb-8">
        <div className="text-8xl md:text-9xl mb-4 select-none opacity-20 filter grayscale">
           🏛️
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl md:text-6xl animate-bounce">🚧</span>
        </div>
      </div>
      
      <h2 className="font-display text-earth text-3xl md:text-4xl font-bold mb-4">
        {title}
      </h2>
      
      <p className="text-stone text-lg max-w-md mx-auto mb-10 leading-relaxed">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href={actionHref}
          className="px-8 py-3 bg-gold text-slate font-bold rounded-full shadow-lg hover:shadow-gold/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {actionLabel}
        </Link>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-surface border border-border text-stone font-semibold rounded-full hover:bg-gold/5 hover:text-gold hover:border-gold/30 transition-all duration-200"
        >
          Try a Ritual Refresh
        </button>
      </div>

      <div className="mt-16 text-stone/40 text-sm italic font-serif">
        "Patience is the shortest path to wisdom." — Ancient Kuvala Proverb (probably)
      </div>
    </div>
  );
}
