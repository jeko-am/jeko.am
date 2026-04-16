'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  admin_notes: string | null;
  replied_at: string | null;
  created_at: string;
}

type StatusFilter = 'all' | 'new' | 'in_progress' | 'resolved' | 'closed';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusColor(status: string): string {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'new':
      return 'New';
    case 'in_progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    case 'closed':
      return 'Closed';
    default:
      return status;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminSupportPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (!error && data) {
      setMessages(data as ContactMessage[]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingStatus(true);
    const updates: Record<string, unknown> = { status: newStatus };
    if (adminNotes.trim()) {
      updates.admin_notes = adminNotes.trim();
    }
    if (newStatus === 'resolved' || newStatus === 'closed') {
      updates.replied_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('contact_messages')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + error.message);
    } else {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, ...updates } as ContactMessage : m
        )
      );
      if (selected?.id === id) {
        setSelected({ ...selected, ...updates } as ContactMessage);
      }
    }
    setUpdatingStatus(false);
  }

  async function deleteMessage(id: string) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  }

  const counts = {
    all: messages.length,
    new: messages.filter((m) => m.status === 'new').length,
    in_progress: messages.filter((m) => m.status === 'in_progress').length,
    resolved: messages.filter((m) => m.status === 'resolved').length,
    closed: messages.filter((m) => m.status === 'closed').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support & Help Queries</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user-submitted queries and support requests
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'new', 'in_progress', 'resolved', 'closed'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setSelected(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-deep-green text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {statusLabel(s)}
            {s === 'all' ? '' : ` (${counts[s]})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Message list */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400">
              Loading...
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400">
              No messages found.
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelected(msg);
                  setAdminNotes(msg.admin_notes || '');
                }}
                className={`w-full text-left bg-white rounded-xl p-4 border transition-all hover:shadow-md ${
                  selected?.id === msg.id
                    ? 'border-deep-green ring-2 ring-deep-green/20'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-deep-green/10 flex items-center justify-center text-deep-green font-bold text-sm flex-shrink-0">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{msg.name}</p>
                      <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor(msg.status)}`}>
                    {statusLabel(msg.status)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">{msg.subject}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{msg.message}</p>
                <p className="text-[11px] text-gray-300 mt-2">{formatDate(msg.created_at)}</p>
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Detail header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{selected.name}</h2>
                  <p className="text-sm text-gray-500">{selected.email}{selected.phone ? ` | ${selected.phone}` : ''}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(selected.status)}`}>
                  {statusLabel(selected.status)}
                </span>
              </div>

              {/* Detail body */}
              <div className="px-6 py-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Subject</p>
                  <p className="text-gray-800 font-medium">{selected.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Message</p>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Submitted</p>
                  <p className="text-gray-600 text-sm">{formatDate(selected.created_at)}</p>
                </div>
                {selected.replied_at && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Replied</p>
                    <p className="text-gray-600 text-sm">{formatDate(selected.replied_at)}</p>
                  </div>
                )}

                {/* Admin notes */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Admin Notes</p>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-deep-green resize-y"
                    placeholder="Add internal notes..."
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selected.status !== 'in_progress' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'in_progress')}
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors disabled:opacity-50"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {selected.status !== 'resolved' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'resolved')}
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {selected.status !== 'closed' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'closed')}
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Delete this message permanently?')) {
                        deleteMessage(selected.id);
                      }
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <p className="text-sm">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
