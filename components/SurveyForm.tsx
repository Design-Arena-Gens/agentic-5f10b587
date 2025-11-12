"use client";

import { useState } from 'react';
import clsx from 'classnames';

type Submission = {
  name?: string;
  email?: string;
  category: string;
  want: string;
  why?: string;
  urgency?: string;
  budget?: string;
  tags?: string[];
  consent: boolean;
  submittedAt: string;
};

const categories = [
  'Work / Productivity',
  'Health & Wellness',
  'Finance',
  'Learning',
  'Home & Personal',
  'Creative',
  'Developer Tools',
  'Other'
];

const urgencies = ['ASAP', 'Soon', 'Sometime', 'Just exploring'];
const budgets = ['Free', '$', '$$', '$$$', 'Not sure'];

export default function SurveyForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: categories[0],
    want: '',
    why: '',
    urgency: urgencies[2],
    budget: budgets[0],
    tags: '' as string,
    consent: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.want || form.want.trim().length < 8) {
      setError('Please describe what you want in at least 8 characters.');
      return;
    }
    if (!form.consent) {
      setError('Please accept the consent to continue.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Submission = {
        name: form.name?.trim() || undefined,
        email: form.email?.trim() || undefined,
        category: form.category,
        want: form.want.trim(),
        why: form.why?.trim() || undefined,
        urgency: form.urgency,
        budget: form.budget,
        tags: form.tags
          ? form.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
        consent: form.consent,
        submittedAt: new Date().toISOString()
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to submit');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-3 text-2xl font-semibold text-gray-900">Thank you!</div>
        <p className="text-gray-600">Your response has been recorded.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/" className="btn btn-primary">Submit another</a>
          <button
            onClick={() => {
              const toCopy = JSON.stringify({
                want: form.want,
                why: form.why,
                category: form.category,
                urgency: form.urgency,
                budget: form.budget,
                tags: form.tags,
                name: form.name,
                email: form.email
              }, null, 2);
              navigator.clipboard.writeText(toCopy);
            }}
            className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            Copy my response
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name (optional)</label>
          <input id="name" name="name" className="input" value={form.name} onChange={onChange} placeholder="Alex" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email (optional)</label>
          <input id="email" type="email" name="email" className="input" value={form.email} onChange={onChange} placeholder="you@example.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" name="category" className="input" value={form.category} onChange={onChange}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="urgency">Urgency</label>
          <select id="urgency" name="urgency" className="input" value={form.urgency} onChange={onChange}>
            {urgencies.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="want">Describe what you want</label>
        <textarea id="want" name="want" className="input min-h-[120px]" value={form.want} onChange={onChange} placeholder="E.g., I want a simple way to..." />
        <p className={clsx('mt-1 text-xs', form.want.length < 8 ? 'text-red-600' : 'text-gray-500')}>
          {form.want.length}/300
        </p>
      </div>

      <div>
        <label className="label" htmlFor="why">Why does this matter? (optional)</label>
        <textarea id="why" name="why" className="input min-h-[100px]" value={form.why} onChange={onChange} placeholder="Because it wastes time / causes stress / blocks progress..." />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="budget">Budget</label>
          <select id="budget" name="budget" className="input" value={form.budget} onChange={onChange}>
            {budgets.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="tags">Tags (comma separated)</label>
          <input id="tags" name="tags" className="input" value={form.tags} onChange={onChange} placeholder="automation, health, mobile" />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 p-4">
        <input id="consent" name="consent" type="checkbox" checked={form.consent} onChange={onChange} className="mt-1 h-4 w-4 accent-brand-600" />
        <label htmlFor="consent" className="text-sm text-gray-700">
          I agree to share this information for research and product design purposes.
        </label>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setForm({
            name: '', email: '', category: categories[0], want: '', why: '', urgency: urgencies[2], budget: budgets[0], tags: '', consent: false
          })}
          className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
        <button disabled={submitting} type="submit" className="btn btn-primary disabled:opacity-50">
          {submitting ? 'Submitting?' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
