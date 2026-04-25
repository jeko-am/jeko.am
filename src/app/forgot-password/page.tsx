'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useT } from '@/lib/i18n/LangProvider';

export default function ForgotPasswordPage() {
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(t('auth.forgot.emailRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=reset`,
      });

      if (resetError) {
        setError(resetError.message);
        setSubmitting(false);
        return;
      }

      setSent(true);
    } catch {
      setError(t('auth.forgot.networkError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-green to-green-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-2xl mb-4 shadow-lg">
            <span className="text-deep-green font-bold text-2xl">PP</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{t('auth.forgot.titleShort')}</h1>
          <p className="text-white/70 text-sm mt-1">
            {sent
              ? t('auth.forgot.checkInbox')
              : t('auth.forgot.subtitleShort')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 text-sm">
                {t('auth.forgot.sentMessage', { email })}
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 text-sm text-deep-green hover:text-green-700 font-medium transition-colors"
              >
                {t('auth.forgot.backToSignIn')}
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('auth.login.emailLabel')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    placeholder={t('auth.forgot.emailPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-deep-green/30 border-t-deep-green rounded-full animate-spin" />
                      {t('auth.forgot.sending')}
                    </>
                  ) : (
                    t('auth.forgot.sendReset')
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-white/70 text-sm hover:text-white transition-colors"
          >
            {t('auth.forgot.backToSignIn')}
          </Link>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          {t('auth.login.happyPets')}
        </p>
      </div>
    </div>
  );
}
