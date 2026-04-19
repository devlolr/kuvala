'use client';

import { useRef, useOptimistic, useTransition, useState, type FormEvent } from 'react';
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

/* ── Floating Label Input ─────────────────────────────────────── */
interface FloatingFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  autoComplete?: string;
  required?: boolean;
  errorId?: string;
  error?: string;
}

function FloatingInput({ id, name, type = 'text', label, autoComplete, required, error, errorId }: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const isLifted = focused || hasValue;

  return (
    <div className="rf-field-wrap">
      <div className={`rf-field ${error ? 'rf-field--error' : ''} ${focused ? 'rf-field--focused' : ''}`}>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          aria-required={required ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder=" "
          className="rf-input"
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); setHasValue(e.target.value !== ''); }}
          onChange={(e) => setHasValue(e.target.value !== '')}
        />
        <label htmlFor={id} className={`rf-label ${isLifted ? 'rf-label--lifted' : ''}`}>
          {label}
          {required && <span className="rf-required" aria-hidden="true"> *</span>}
        </label>
        <span className="rf-focus-line" />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="rf-error-msg"
          >
            <span aria-hidden="true">⚠ </span>{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Floating Label Textarea ──────────────────────────────────── */
function FloatingTextarea({ id, name, label, error, errorId }: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isLifted = focused || hasValue;

  return (
    <div className="rf-field-wrap">
      <div className={`rf-field rf-field--area ${error ? 'rf-field--error' : ''} ${focused ? 'rf-field--focused' : ''}`}>
        <textarea
          id={id}
          name={name}
          rows={3}
          maxLength={500}
          placeholder=" "
          className="rf-input rf-textarea"
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); setHasValue(e.target.value !== ''); }}
          onChange={(e) => setHasValue(e.target.value !== '')}
        />
        <label htmlFor={id} className={`rf-label ${isLifted ? 'rf-label--lifted' : ''}`}>
          {label}
        </label>
        <span className="rf-focus-line" />
      </div>
    </div>
  );
}

/* ── Decorative SVG Mandala ───────────────────────────────────── */
function MandalaDeco({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.4" />
      {/* Mid ring */}
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {/* Inner ring */}
      <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
      {/* 8 petal lotus */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        const x1 = 100 + 28 * Math.cos(a);
        const y1 = 100 + 28 * Math.sin(a);
        const x2 = 100 + 50 * Math.cos(a - 0.3);
        const y2 = 100 + 50 * Math.sin(a - 0.3);
        const x3 = 100 + 50 * Math.cos(a + 0.3);
        const y3 = 100 + 50 * Math.sin(a + 0.3);
        return <path key={i} d={`M${x1},${y1} Q${x2},${y2} 100,100 Q${x3},${y3} ${x1},${y1}Z`} stroke="currentColor" strokeWidth="0.5" opacity="0.35" />;
      })}
      {/* 12 outer petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x = 100 + 82 * Math.cos(a);
        const y = 100 + 82 * Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="3" fill="currentColor" opacity="0.25" />;
      })}
      {/* Centre dot */}
      <circle cx="100" cy="100" r="5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

/* ── Success State ────────────────────────────────────────────── */
function SuccessPanel({ eventName }: { eventName: string }) {
  return (
    <motion.div
      variants={ANIMATION_PRESETS.scalePop}
      initial="hidden"
      animate="visible"
      className="rf-success"
      role="status"
      aria-live="polite"
    >
      {/* Animated checkmark ring */}
      <div className="rf-success-ring">
        <svg viewBox="0 0 80 80" fill="none" className="rf-success-svg">
          <motion.circle
            cx="40" cy="40" r="36"
            stroke="url(#goldRing)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="226"
            initial={{ strokeDashoffset: 226 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M24 40 L36 52 L56 30"
            stroke="url(#goldRing)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="50"
            initial={{ strokeDashoffset: 50 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.5, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="goldRing" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--color-gold-light)" />
              <stop offset="1" stopColor="var(--color-gold)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting particles */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <motion.div
            key={i}
            className="rf-particle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ delay: 0.8 + i * 0.08, duration: 0.8, repeat: 0 }}
            style={{ '--deg': `${deg}deg` } as React.CSSProperties}
          />
        ))}
      </div>

      <motion.h3
        className="rf-success-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        You&apos;re Registered!
      </motion.h3>

      <motion.p
        className="rf-success-body"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.5 }}
      >
        A confirmation has been sent to your inbox for{' '}
        <strong>{eventName}</strong>.
      </motion.p>

      {/* Decorative mandala */}
      <MandalaDeco className="rf-success-mandala" />
    </motion.div>
  );
}

/* ── Main Form ──────────────────────────────────────────────────── */
export default function RegistrationForm({ eventId, eventName }: Props) {
  const { t } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticState, setOptimistic] = useOptimistic<FormState>(
    { status: 'idle' },
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('event_id', eventId);

    startTransition(async () => {
      setOptimistic({ status: 'success' });
      const result: RegisterResult = await registerForEvent(formData);
      if (!result.success) {
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

  if (optimisticState.status === 'success') {
    return <SuccessPanel eventName={eventName} />;
  }

  const fieldError = (field: string) =>
    optimisticState.status === 'error'
      ? optimisticState.fieldErrors?.[field]?.[0]
      : undefined;

  return (
    <>
      {/* Scoped styles — isolated to this component */}
      <style>{`
        /* ── Layout ── */
        .rf-root {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 2rem 2rem 1.75rem;
          border-radius: 1.5rem;
          overflow: hidden;
          isolation: isolate;
        }

        /* Glassmorphism shell */
        .rf-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg,
              rgba(var(--rf-r, 255), var(--rf-g, 255), var(--rf-b, 255), 0.04) 0%,
              rgba(var(--rf-r, 255), var(--rf-g, 255), var(--rf-b, 255), 0.01) 100%
            );
          border-radius: inherit;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: -1;
        }

        /* Animated gradient border */
        .rf-root::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: calc(1.5rem + 1px);
          background: linear-gradient(
            135deg,
            var(--color-gold-light),
            var(--color-gold),
            var(--color-terracotta),
            var(--color-gold),
            var(--color-gold-light)
          );
          background-size: 300% 300%;
          animation: rf-border-spin 5s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1px;
          z-index: -1;
          opacity: 0.7;
        }

        @keyframes rf-border-spin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ── Decorative corner mandala ── */
        .rf-deco-mandala {
          position: absolute;
          top: -2rem;
          right: -2rem;
          width: 9rem;
          height: 9rem;
          color: var(--color-gold);
          opacity: 0.08;
          pointer-events: none;
          animation: rf-spin-slow 40s linear infinite;
          z-index: -1;
        }

        @keyframes rf-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Header ── */
        .rf-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .rf-eyebrow {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: linear-gradient(90deg, var(--color-gold-light), var(--color-gold));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .rf-title {
          font-family: var(--heading-font);
          font-size: clamp(1.15rem, 2.5vw, 1.45rem);
          font-weight: 700;
          color: var(--foreground);
          line-height: 1.3;
        }

        /* ── Divider ── */
        .rf-divider {
          width: 2.5rem;
          height: 1.5px;
          background: linear-gradient(90deg, var(--color-gold), transparent);
          border: none;
          margin: 0;
        }

        /* ── Field ── */
        .rf-field-wrap { display: flex; flex-direction: column; gap: 0.3rem; }

        .rf-field {
          position: relative;
          border-radius: 0.75rem;
          background: var(--surface);
          border: 1px solid var(--border);
          transition: border-color 250ms ease, box-shadow 250ms ease;
          overflow: hidden;
        }

        .rf-field--focused {
          border-color: var(--color-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.12), 0 2px 12px rgba(212, 175, 55, 0.08);
        }

        .rf-field--error {
          border-color: var(--color-terracotta) !important;
          box-shadow: 0 0 0 3px rgba(154, 42, 42, 0.1) !important;
        }

        .rf-input {
          width: 100%;
          padding: 1.4rem 1rem 0.55rem;
          font-size: 0.875rem;
          font-family: var(--body-font);
          background: transparent;
          color: var(--foreground);
          border: none;
          outline: none;
          line-height: 1.4;
        }

        .rf-textarea {
          resize: none;
          min-height: 96px;
        }

        .rf-input::placeholder { color: transparent; }

        /* Focus line sliding in from left */
        .rf-focus-line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 0%;
          background: linear-gradient(90deg, var(--color-gold-light), var(--color-gold));
          border-radius: 0 0 0.75rem 0.75rem;
          transition: width 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .rf-field--focused .rf-focus-line { width: 100%; }

        /* ── Floating label ── */
        .rf-label {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.875rem;
          color: var(--muted);
          pointer-events: none;
          transition: all 220ms cubic-bezier(0.22, 1, 0.36, 1);
          background: transparent;
        }

        .rf-field--area .rf-label {
          top: 1rem;
          transform: none;
        }

        .rf-label--lifted {
          top: 0.45rem;
          transform: none;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--color-gold);
        }

        .rf-field--area .rf-label--lifted {
          top: 0.4rem;
        }

        .rf-required { color: var(--color-terracotta); }

        /* ── Error message ── */
        .rf-error-msg {
          font-size: 0.7rem;
          color: var(--color-terracotta);
          padding-left: 0.25rem;
        }

        /* ── Global error banner ── */
        .rf-error-banner {
          padding: 0.75rem 1rem;
          border-radius: 0.625rem;
          background: rgba(154, 42, 42, 0.08);
          border: 1px solid rgba(154, 42, 42, 0.25);
          color: var(--color-terracotta);
          font-size: 0.8rem;
          line-height: 1.5;
        }

        /* ── Submit button ── */
        .rf-submit {
          position: relative;
          width: 100%;
          padding: 0.95rem 1.5rem;
          border-radius: 0.875rem;
          border: none;
          cursor: pointer;
          font-family: var(--heading-font);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #241C15;
          background: linear-gradient(135deg, var(--color-gold-light) 0%, var(--color-gold) 50%, #9A6B00 100%);
          background-size: 200% 200%;
          overflow: hidden;
          transition: box-shadow 300ms ease, opacity 200ms ease;
          box-shadow: 0 4px 20px rgba(175, 130, 49, 0.35), 0 1px 0 rgba(255,255,255,0.15) inset;
        }

        .rf-submit:not(:disabled):hover {
          background-position: 100% 0%;
          box-shadow: 0 6px 32px rgba(175, 130, 49, 0.5), 0 1px 0 rgba(255,255,255,0.2) inset;
        }

        .rf-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Shimmer sweep across button */
        .rf-submit::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          animation: rf-btn-shimmer 2.4s ease-in-out infinite;
        }

        .rf-submit:disabled::before { display: none; }

        @keyframes rf-btn-shimmer {
          0%   { left: -60%; }
          100% { left: 150%; }
        }

        .rf-submit-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Spinning loader */
        .rf-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(36,28,21,0.3);
          border-top-color: #241C15;
          border-radius: 50%;
          animation: rf-spin 0.7s linear infinite;
        }

        @keyframes rf-spin {
          to { transform: rotate(360deg); }
        }

        /* ── Privacy hint ── */
        .rf-privacy {
          text-align: center;
          font-size: 0.68rem;
          color: var(--muted);
          line-height: 1.5;
          opacity: 0.75;
        }

        .rf-privacy a {
          color: var(--color-gold);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* ── Success panel ── */
        .rf-success {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem 2rem 2.5rem;
          border-radius: 1.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
          overflow: hidden;
          isolation: isolate;
        }

        .rf-success-ring {
          position: relative;
          width: 5rem;
          height: 5rem;
          margin-bottom: 1.25rem;
        }

        .rf-success-svg {
          width: 100%;
          height: 100%;
        }

        .rf-particle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0.35rem;
          height: 0.35rem;
          border-radius: 50%;
          background: var(--color-gold);
          transform-origin: 2.5rem 2.5rem;
          transform: rotate(var(--deg)) translateX(2.5rem) translateY(-50%);
          margin-top: -0.175rem;
          margin-left: -0.175rem;
        }

        .rf-success-title {
          font-family: var(--heading-font);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .rf-success-body {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.6;
          max-width: 22rem;
        }

        .rf-success-body strong {
          color: var(--color-gold);
        }

        .rf-success-mandala {
          position: absolute;
          bottom: -3rem;
          right: -3rem;
          width: 12rem;
          height: 12rem;
          color: var(--color-gold);
          opacity: 0.06;
          pointer-events: none;
          animation: rf-spin-slow 60s linear infinite;
          z-index: -1;
        }
      `}</style>

      <motion.form
        ref={formRef}
        onSubmit={handleSubmit}
        variants={ANIMATION_PRESETS.fadeInUp}
        initial="hidden"
        animate="visible"
        noValidate
        className="rf-root"
        aria-label={`Registration form for ${eventName}`}
      >
        {/* Corner mandala decoration */}
        <MandalaDeco className="rf-deco-mandala" />

        {/* ── Header ── */}
        <div className="rf-header">
          <span className="rf-eyebrow">Secure Registration</span>
          <h2 className="rf-title">{eventName}</h2>
          <hr className="rf-divider" />
        </div>

        {/* ── Global error banner ── */}
        <AnimatePresence>
          {optimisticState.status === 'error' && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div role="alert" className="rf-error-banner">
                {optimisticState.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Name ── */}
        <FloatingInput
          id="reg-name"
          name="name"
          type="text"
          label={t('form.name')}
          autoComplete="name"
          required
          error={fieldError('name')}
          errorId="reg-name-error"
        />

        {/* ── Email ── */}
        <FloatingInput
          id="reg-email"
          name="email"
          type="email"
          label={t('form.email')}
          autoComplete="email"
          required
          error={fieldError('email')}
          errorId="reg-email-error"
        />

        {/* ── Phone ── */}
        <FloatingInput
          id="reg-phone"
          name="phone"
          type="tel"
          label={t('form.phone')}
          autoComplete="tel"
        />

        {/* ── Message ── */}
        <FloatingTextarea
          id="reg-message"
          name="message"
          label={t('form.message')}
        />

        {/* ── Submit ── */}
        <motion.button
          id="reg-submit"
          type="submit"
          disabled={isPending}
          whileTap={isPending ? {} : { scale: 0.975 }}
          className="rf-submit"
        >
          <span className="rf-submit-inner">
            {isPending && <span className="rf-spinner" aria-hidden="true" />}
            {isPending ? t('form.submitting') : t('form.submit')}
          </span>
        </motion.button>

        {/* ── Privacy note ── */}
        <p className="rf-privacy">
          🔒 Your information is private &amp; never shared.
        </p>
      </motion.form>
    </>
  );
}
