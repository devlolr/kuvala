'use client';

import { useRef, useOptimistic, useTransition, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerForEvent, type RegisterResult } from '@/app/actions/register';
import { useI18n } from '@/i18n';
import { ANIMATION_PRESETS } from '@/lib/theme';

interface Props {
  eventId:   string;
  eventName: string;
}

type FormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> };

export default function RegistrationForm({ eventId, eventName }: Props) {
  const { t } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);

  // useOptimistic: instant UI update before server responds
  const [optimisticState, setOptimistic] = useOptimistic<FormState>(
    { status: 'idle' },
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('event_id', eventId);

    startTransition(async () => {
      // Optimistic: show success immediately
      setOptimistic({ status: 'success' });

      const result: RegisterResult = await registerForEvent(formData);

      if (!result.success) {
        // Revert to error state if server says no
        setOptimistic({
          status:      'error',
          message:     result.error,
          fieldErrors: (result as { success: false; error: string; fieldErrors?: Record<string, string[]> }).fieldErrors,
        });
      } else {
        formRef.current?.reset();
      }
    });
  };

  /* ── Success State ─────────────────────────────────────── */
  if (optimisticState.status === 'success') {
    return (
      <motion.div
        variants={ANIMATION_PRESETS.scalePop}
        initial="hidden"
        animate="visible"
        className="text-center p-10 card-heritage rounded-2xl"
        role="status"
        aria-live="polite"
      >
        <div className="text-5xl mb-4" role="img" aria-label="success">✓</div>
        <h3 className="font-display text-2xl text-earth font-bold mb-2">
          {t('event.registered')}
        </h3>
        <p className="text-stone text-sm">
          You&apos;re registered for <strong>{eventName}</strong>.<br />
          Check your email for confirmation.
        </p>
      </motion.div>
    );
  }

  /* ── Form ──────────────────────────────────────────────── */
  const fieldError = (field: string) =>
    optimisticState.status === 'error'
      ? optimisticState.fieldErrors?.[field]?.[0]
      : undefined;

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      variants={ANIMATION_PRESETS.fadeInUp}
      initial="hidden"
      animate="visible"
      noValidate
      className="flex flex-col gap-5"
      aria-label={`Registration form for ${eventName}`}
    >
      {/* Global error */}
      <AnimatePresence>
        {optimisticState.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="px-4 py-3 rounded-lg bg-terracotta/10 border border-terracotta/30 text-terracotta text-sm"
          >
            {optimisticState.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-name" className="text-sm font-semibold text-earth">
          {t('form.name')} <span className="text-terracotta" aria-hidden="true">*</span>
        </label>
        <input
          id="reg-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-describedby={fieldError('name') ? 'reg-name-error' : undefined}
          placeholder="Your full name"
          className={`
            px-4 py-3 rounded-xl border text-sm bg-surface text-foreground
            placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-gold/40
            transition-all duration-200
            ${fieldError('name')
              ? 'border-terracotta focus:ring-terracotta/30'
              : 'border-border hover:border-gold/40'
            }
          `}
        />
        {fieldError('name') && (
          <p id="reg-name-error" role="alert" className="text-terracotta text-xs">
            {fieldError('name')}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-email" className="text-sm font-semibold text-earth">
          {t('form.email')} <span className="text-terracotta" aria-hidden="true">*</span>
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-describedby={fieldError('email') ? 'reg-email-error' : undefined}
          placeholder="you@example.com"
          className={`
            px-4 py-3 rounded-xl border text-sm bg-surface text-foreground
            placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-gold/40
            transition-all duration-200
            ${fieldError('email')
              ? 'border-terracotta focus:ring-terracotta/30'
              : 'border-border hover:border-gold/40'
            }
          `}
        />
        {fieldError('email') && (
          <p id="reg-email-error" role="alert" className="text-terracotta text-xs">
            {fieldError('email')}
          </p>
        )}
      </div>

      {/* Phone — optional */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-phone" className="text-sm font-semibold text-earth">
          {t('form.phone')}
        </label>
        <input
          id="reg-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          className="
            px-4 py-3 rounded-xl border border-border text-sm bg-surface text-foreground
            placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-gold/40
            hover:border-gold/40 transition-all duration-200
          "
        />
      </div>

      {/* Message — optional */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-message" className="text-sm font-semibold text-earth">
          {t('form.message')}
        </label>
        <textarea
          id="reg-message"
          name="message"
          rows={3}
          maxLength={500}
          placeholder="Any questions or dietary needs…"
          className="
            px-4 py-3 rounded-xl border border-border text-sm bg-surface text-foreground
            placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-gold/40
            hover:border-gold/40 transition-all duration-200 resize-none
          "
        />
      </div>

      {/* Submit */}
      <motion.button
        id="reg-submit"
        type="submit"
        disabled={isPending}
        whileTap={{ scale: 0.97 }}
        className="
          w-full py-4 rounded-xl font-semibold text-sm
          gradient-gold text-slate shadow-gold
          hover:shadow-glow active:scale-95
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-300
        "
      >
        {isPending ? t('form.submitting') : t('form.submit')}
      </motion.button>
    </motion.form>
  );
}
