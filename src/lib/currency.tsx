'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const SUPPORTED_CURRENCIES = [
  { code: 'GBP', symbol: '£',  locale: 'en-GB', label: 'British Pound' },
  { code: 'USD', symbol: '$',  locale: 'en-US', label: 'US Dollar' },
  { code: 'EUR', symbol: '€',  locale: 'de-DE', label: 'Euro' },
  { code: 'AMD', symbol: '֏',  locale: 'hy-AM', label: 'Armenian Dram' },
  { code: 'RUB', symbol: '₽',  locale: 'ru-RU', label: 'Russian Ruble' },
  { code: 'INR', symbol: '₹',  locale: 'en-IN', label: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', locale: 'en-CA', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', locale: 'en-AU', label: 'Australian Dollar' },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]['code'];

export interface CurrencyConfig {
  code:   CurrencyCode;
  symbol: string;
  locale: string;
}

const BASE_CURRENCY: CurrencyCode = 'GBP';
const DEFAULT: CurrencyConfig = { code: 'GBP', symbol: '£', locale: 'en-GB' };
const STORAGE_KEY = 'jeko.currency';

interface Ctx {
  currency: CurrencyConfig;
  rates:    Record<string, number>;
  fetchedAt: string | null;
  /** Convert a base-currency amount into the active currency. */
  convert:  (amount: number) => number;
  /** Convert + format using the active currency's locale. */
  formatPrice: (amount: number) => string;
  setCurrency: (code: CurrencyCode) => Promise<void>;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT;
    try {
      const cached = window.localStorage.getItem(STORAGE_KEY);
      if (cached) return JSON.parse(cached) as CurrencyConfig;
    } catch {}
    return DEFAULT;
  });
  const [rates, setRates]     = useState<Record<string, number>>({ GBP: 1 });
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const refreshRates = useCallback(async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/currency-rates`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
      });
      if (!res.ok) throw new Error(`rates ${res.status}`);
      const body = await res.json();
      if (body?.rates) {
        setRates(body.rates);
        setFetchedAt(body.fetched_at ?? null);
      }
    } catch (err) {
      // Fall back to whatever is in the table directly.
      const { data } = await supabase
        .from('currency_rates')
        .select('rates, fetched_at')
        .eq('id', 1)
        .maybeSingle();
      if (data?.rates) {
        setRates(data.rates as Record<string, number>);
        setFetchedAt(data.fetched_at ?? null);
      }
      // eslint-disable-next-line no-console
      console.warn('[currency] refresh failed, using cached rates', err);
    }
  }, []);

  // Load currency choice + rates on mount.
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'currency')
        .maybeSingle();
      if (alive && data?.value) {
        const v = data.value as CurrencyConfig;
        setCurrencyState(v);
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {}
      }
      await refreshRates();
    })();
    return () => { alive = false; };
  }, [refreshRates]);

  const setCurrency = useCallback(async (code: CurrencyCode) => {
    const found = SUPPORTED_CURRENCIES.find(c => c.code === code) ?? SUPPORTED_CURRENCIES[0];
    const next: CurrencyConfig = { code: found.code, symbol: found.symbol, locale: found.locale };
    setCurrencyState(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    await supabase
      .from('app_settings')
      .upsert({ key: 'currency', value: next, updated_at: new Date().toISOString() });
  }, []);

  const convert = useCallback((amount: number) => {
    if (!Number.isFinite(amount)) return 0;
    if (currency.code === BASE_CURRENCY) return amount;
    const rate = rates?.[currency.code];
    if (!rate || !Number.isFinite(rate)) return amount;
    return amount * rate;
  }, [rates, currency.code]);

  const formatPrice = useCallback((amount: number) => {
    const value = convert(amount);
    try {
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currency.code,
      }).format(value);
    } catch {
      return `${currency.symbol}${value.toFixed(2)}`;
    }
  }, [convert, currency]);

  const value = useMemo<Ctx>(() => ({
    currency, rates, fetchedAt, convert, formatPrice, setCurrency, refreshRates,
  }), [currency, rates, fetchedAt, convert, formatPrice, setCurrency, refreshRates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Safe SSR/no-provider fallback: identity formatter at base currency.
    const fmt = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
    return {
      currency: DEFAULT,
      rates: { GBP: 1 },
      fetchedAt: null,
      convert: (a) => a,
      formatPrice: (a) => fmt.format(a),
      setCurrency: async () => {},
      refreshRates: async () => {},
    };
  }
  return ctx;
}
