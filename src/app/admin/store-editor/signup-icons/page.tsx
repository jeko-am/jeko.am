'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { QIcon } from '@/lib/signupIcons';

type Group = {
  title: string;
  options: { key: string; label: string; defaultKey: keyof typeof QIcon }[];
};

const GROUPS: Group[] = [
  {
    title: 'Step 1 — Pet Type',
    options: [
      { key: 'Dog', label: 'Dog', defaultKey: 'dog' },
      { key: 'Cat', label: 'Cat', defaultKey: 'cat' },
    ],
  },
  {
    title: 'Step 3 — Gender',
    options: [
      { key: 'Male',   label: 'Male',   defaultKey: 'male'   },
      { key: 'Female', label: 'Female', defaultKey: 'female' },
    ],
  },
  {
    title: 'Step 4 — Temperament',
    options: [
      { key: 'Calm',       label: 'Calm',       defaultKey: 'calm'       },
      { key: 'Playful',    label: 'Playful',    defaultKey: 'playful'    },
      { key: 'Energetic',  label: 'Energetic',  defaultKey: 'energetic'  },
      { key: 'Shy',        label: 'Shy',        defaultKey: 'shy'        },
      { key: 'Protective', label: 'Protective', defaultKey: 'protective' },
      { key: 'Friendly',   label: 'Friendly',   defaultKey: 'friendly'   },
    ],
  },
  {
    title: 'Step 5 — Disabilities',
    options: [
      { key: 'disability:None',            label: 'None',            defaultKey: 'none'     },
      { key: 'disability:Blind',           label: 'Blind',           defaultKey: 'blind'    },
      { key: 'disability:Deaf',            label: 'Deaf',            defaultKey: 'deaf'     },
      { key: 'disability:Mobility Issues', label: 'Mobility Issues', defaultKey: 'mobility' },
      { key: 'disability:Amputee',         label: 'Amputee',         defaultKey: 'amputee'  },
      { key: 'disability:Epilepsy',        label: 'Epilepsy',        defaultKey: 'epilepsy' },
      { key: 'disability:Anxiety',         label: 'Anxiety',         defaultKey: 'anxiety'  },
      { key: 'disability:Other',           label: 'Other',           defaultKey: 'other'    },
    ],
  },
  {
    title: 'Step 5 — Allergies',
    options: [
      { key: 'allergy:None',    label: 'None',    defaultKey: 'allergyNone' },
      { key: 'allergy:Chicken', label: 'Chicken', defaultKey: 'chicken'     },
      { key: 'allergy:Beef',    label: 'Beef',    defaultKey: 'beef'        },
      { key: 'allergy:Grain',   label: 'Grain',   defaultKey: 'grain'       },
      { key: 'allergy:Dairy',   label: 'Dairy',   defaultKey: 'dairy'       },
      { key: 'allergy:Eggs',    label: 'Eggs',    defaultKey: 'eggs'        },
      { key: 'allergy:Soy',     label: 'Soy',     defaultKey: 'soy'         },
      { key: 'allergy:Fish',    label: 'Fish',    defaultKey: 'fish'        },
      { key: 'allergy:Pollen',  label: 'Pollen',  defaultKey: 'pollen'      },
      { key: 'allergy:Dust',    label: 'Dust',    defaultKey: 'dust'        },
      { key: 'allergy:Flea',    label: 'Flea',    defaultKey: 'flea'        },
      { key: 'allergy:Other',   label: 'Other',   defaultKey: 'other'       },
    ],
  },
  {
    title: 'Step 6 — Diet',
    options: [
      { key: 'diet:Raw',        label: 'Raw',        defaultKey: 'raw'        },
      { key: 'diet:Kibble',     label: 'Kibble',     defaultKey: 'kibble'     },
      { key: 'diet:Mixed',      label: 'Mixed',      defaultKey: 'mixed'      },
      { key: 'diet:Homemade',   label: 'Homemade',   defaultKey: 'homemade'   },
      { key: 'diet:Jeko',       label: 'Jeko',       defaultKey: 'plant'      },
      { key: 'diet:Chicken',    label: 'Chicken',    defaultKey: 'chicken'    },
      { key: 'diet:Beef',       label: 'Beef',       defaultKey: 'beef'       },
      { key: 'diet:Lamb',       label: 'Lamb',       defaultKey: 'lamb'       },
      { key: 'diet:Vegetables', label: 'Vegetables', defaultKey: 'vegetables' },
    ],
  },
  {
    title: 'Step 7 — Looking for a match',
    options: [
      { key: 'matchYes', label: 'Yes',        defaultKey: 'heart' },
      { key: 'matchNo',  label: 'No, thanks', defaultKey: 'no'    },
    ],
  },
];

type IconMap = Record<string, string>;

export default function SignupIconsPage() {
  const [icons, setIcons]     = useState<IconMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'signup_option_icons')
        .maybeSingle();
      if (data?.value && typeof data.value === 'object') setIcons(data.value as IconMap);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2500);
    return () => clearTimeout(t);
  }, [msg]);

  async function persist(next: IconMap) {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ key: 'signup_option_icons', value: next, updated_at: new Date().toISOString() });
      if (error) throw error;
      setMsg({ kind: 'ok', text: 'Saved' });
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Failed to save' });
    } finally {
      setSaving(false);
    }
  }

  function setIcon(key: string, url: string) {
    const next = { ...icons };
    if (url) next[key] = url; else delete next[key];
    setIcons(next);
    persist(next);
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/store-editor" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Store editor
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-vag">Signup Quiz Card Icons</h1>
        <p className="text-sm text-gray-500 mt-1">
          Each card already shows its built-in icon. Upload a custom image to override it; remove
          the upload to restore the default.
        </p>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          msg.kind === 'ok'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>{msg.text}</div>
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <div className="space-y-6">
          {GROUPS.map(g => (
            <div key={g.title} className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">{g.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {g.options.map(opt => (
                  <OptionRow
                    key={opt.key}
                    optionKey={opt.key}
                    label={opt.label}
                    value={icons[opt.key] || ''}
                    fallback={QIcon[opt.defaultKey]}
                    busy={saving}
                    onChange={url => setIcon(opt.key, url)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OptionRow({
  optionKey, label, value, fallback, busy, onChange,
}: {
  optionKey: string;
  label: string;
  value: string;
  fallback: React.ReactNode;
  busy: boolean;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  const isDefault = !value;

  return (
    <div className="flex items-center gap-3 border border-gray-100 rounded-lg p-2">
      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 text-gray-500">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="scale-75">{fallback}</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate flex items-center gap-1.5">
          {label}
          {isDefault && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-normal">default</span>
          )}
        </div>
        <div className="text-[11px] text-gray-400 font-mono truncate">{optionKey}</div>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          disabled={busy || uploading}
          onClick={() => inputRef.current?.click()}
          className="px-2.5 py-1 text-xs font-medium bg-deep-green text-white rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? '…' : value ? 'Replace' : 'Upload'}
        </button>
        {value && (
          <button
            disabled={busy}
            onClick={() => onChange('')}
            className="px-2.5 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 disabled:opacity-50"
          >
            Reset
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ''; }}
        />
      </div>
    </div>
  );
}
