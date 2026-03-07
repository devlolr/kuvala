'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

/* ── Validation Schema ─────────────────────────────────────── */
const RegistrationSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Please enter a valid email address'),
  phone:    z.string().optional(),
  event_id: z.string().min(1, 'Event ID is required'),
  message:  z.string().max(500).optional(),
});

/* ── Return type ────────────────────────────────────────────── */
export type RegisterResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/* ── Server Action ──────────────────────────────────────────── */
export async function registerForEvent(
  formData: FormData,
): Promise<RegisterResult> {
  // Parse + validate
  const raw = {
    name:     formData.get('name'),
    email:    formData.get('email'),
    phone:    formData.get('phone') || undefined,
    event_id: formData.get('event_id'),
    message:  formData.get('message') || undefined,
  };

  const parsed = RegistrationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success:     false,
      error:       'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Insert into Supabase
  try {
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from('registrations')
      .insert([parsed.data]);

    if (dbError) {
      // Duplicate email for same event — friendly message
      if (dbError.code === '23505') {
        return { success: false, error: 'You have already registered for this event.' };
      }
      console.error('[Registration] Supabase error:', dbError);
      return { success: false, error: 'Registration failed. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('[Registration] Unexpected error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
