import React from 'react';
import { Download, ChevronRight, ChevronLeft, Check, Phone, Star, ArrowRight } from 'lucide-react';

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
//
// Brand Colors
export const colors = {
  primary:      '#e3a692',
  primaryDark:  '#d97d6a',
  primaryDarker:'#c66c5a',
  primaryBg:    '#fdf8f6',
  primaryBorder:'rgba(227,166,146,0.2)',

  gray900: '#111827',
  gray700: '#374151',
  gray600: '#4b5563',
  gray500: '#6b7280',
  gray400: '#9ca3af',
  gray200: '#e5e7eb',
  gray100: '#f3f4f6',
  gray50:  '#f9fafb',

  success: '#10b981',
  successBg: '#ecfdf5',
  error:   '#ef4444',
  errorBg: '#fef2f2',
};

// Typography
export const typography = {
  fontFamily: "'Inter', sans-serif",
  scale: {
    xs:   '0.75rem',   // 12px
    sm:   '0.875rem',  // 14px
    base: '1rem',      // 16px
    lg:   '1.125rem',  // 18px
    xl:   '1.25rem',   // 20px
    '2xl':'1.5rem',    // 24px
    '3xl':'1.875rem',  // 30px
    '4xl':'2.25rem',   // 36px
  },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700, black: 800 },
};

// Spacing (Tailwind-based, px)
export const spacing = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];

// Border radius
export const radius = {
  sm:   '0.5rem',   // rounded-lg
  md:   '0.75rem',  // rounded-xl
  lg:   '1rem',     // rounded-2xl
  full: '9999px',
};

// Shadows
export const shadows = {
  sm:      '0 1px 3px rgba(0,0,0,0.07)',
  md:      '0 4px 14px rgba(0,0,0,0.05)',
  primary: '0 4px 24px rgba(227,166,146,0.35)',
};

// ─── DESIGN SYSTEM PAGE ─────────────────────────────────────────────────────

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto bg-white shadow-xl">

        {/* Header */}
        <header className="px-6 pt-8 pb-6 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e3a692] mb-1">Immobiliare DIBA</p>
          <h1 className="text-3xl font-black text-gray-900">Design System</h1>
          <p className="text-sm text-gray-500 mt-1">Palette, tipografia, componenti e token.</p>
        </header>

        <div className="px-6 space-y-12 pt-8">

          {/* ── COLORS ────────────────────────────────────────── */}
          <section className="space-y-4">
            <SectionTitle>Colori</SectionTitle>

            <div className="space-y-3">
              <Label>Brand</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Primary',       hex: '#e3a692', text: 'white' },
                  { name: 'Dark',          hex: '#d97d6a', text: 'white' },
                  { name: 'Darker',        hex: '#c66c5a', text: 'white' },
                  { name: 'Light BG',      hex: '#fdf8f6', text: '#d97d6a', border: true },
                ].map(c => (
                  <div key={c.name} className="space-y-1">
                    <div
                      className={`h-16 rounded-xl flex items-end p-2 ${c.border ? 'border border-[#e3a692]/20' : ''}`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="text-[10px] font-bold" style={{ color: c.text }}>{c.hex}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium text-center">{c.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Neutrali</Label>
              <div className="flex gap-1.5">
                {[
                  { shade: '900', hex: '#111827' },
                  { shade: '700', hex: '#374151' },
                  { shade: '500', hex: '#6b7280' },
                  { shade: '400', hex: '#9ca3af' },
                  { shade: '200', hex: '#e5e7eb' },
                  { shade: '100', hex: '#f3f4f6' },
                  { shade: '50',  hex: '#f9fafb', border: true },
                ].map(c => (
                  <div key={c.shade} className="flex-1 space-y-1">
                    <div
                      className={`h-10 rounded-lg ${c.border ? 'border border-gray-200' : ''}`}
                      style={{ backgroundColor: c.hex }}
                    />
                    <p className="text-[10px] text-gray-400 text-center">{c.shade}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Semantici</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-[#ecfdf5] rounded-xl border border-[#10b981]/20">
                  <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                  <div>
                    <p className="text-xs font-bold text-[#065f46]">Success</p>
                    <p className="text-[10px] text-[#10b981]">#10b981</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-[#fef2f2] rounded-xl border border-[#ef4444]/20">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <div>
                    <p className="text-xs font-bold text-[#7f1d1d]">Error</p>
                    <p className="text-[10px] text-[#ef4444]">#ef4444</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── TYPOGRAPHY ────────────────────────────────────── */}
          <section className="space-y-4">
            <SectionTitle>Tipografia</SectionTitle>
            <p className="text-xs text-gray-400 font-medium -mt-2">Inter — Google Fonts</p>

            <div className="space-y-4 pt-1">
              {[
                { label: 'Display / H1', size: 'text-3xl', weight: 'font-black', sample: 'Valuta il tuo immobile' },
                { label: 'H2',           size: 'text-2xl', weight: 'font-bold',  sample: 'Dove si trova?' },
                { label: 'H3',           size: 'text-xl',  weight: 'font-bold',  sample: 'Dettagli immobile' },
                { label: 'Lead / Intro', size: 'text-base',weight: 'font-medium',sample: 'Inserisci i dati del tuo immobile' },
                { label: 'Body',         size: 'text-sm',  weight: 'font-normal',sample: 'Compila tutti i campi per ottenere una valutazione accurata.' },
                { label: 'Caption',      size: 'text-xs',  weight: 'font-medium',sample: 'Passo 1 di 4 · 25%' },
              ].map(t => (
                <div key={t.label} className="flex items-baseline gap-4 py-3 border-b border-gray-50">
                  <span className="text-[10px] text-gray-400 font-medium w-24 shrink-0">{t.label}</span>
                  <span className={`text-gray-900 ${t.size} ${t.weight} leading-tight`}>{t.sample}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── BUTTONS ───────────────────────────────────────── */}
          <section className="space-y-4">
            <SectionTitle>Pulsanti</SectionTitle>
            <div className="space-y-3">

              <div className="space-y-1">
                <Label>Primary</Label>
                <button className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-[#e3a692] hover:bg-[#d97d6a] transition-all shadow-lg shadow-[#e3a692]/30">
                  Avanti <ChevronRight size={18} />
                </button>
              </div>

              <div className="space-y-1">
                <Label>Primary Dark (CTA forte)</Label>
                <button className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-[#d97d6a] hover:bg-[#c66c5a] transition-all shadow-lg shadow-[#d97d6a]/30">
                  <Phone size={18} /> Chiama ora: 327 491 1031
                </button>
              </div>

              <div className="space-y-1">
                <Label>Secondary</Label>
                <button className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <ChevronLeft size={18} /> Indietro
                </button>
              </div>

              <div className="space-y-1">
                <Label>Outline Brand</Label>
                <button className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold border-2 border-[#e3a692] text-[#e3a692] hover:bg-[#fdf8f6] transition-colors">
                  Nuova Valutazione
                </button>
              </div>

              <div className="space-y-1">
                <Label>Disabled</Label>
                <button disabled className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-gray-300 cursor-not-allowed">
                  Avanti <ChevronRight size={18} />
                </button>
              </div>

              <div className="space-y-1">
                <Label>Ghost / Link</Label>
                <button className="text-sm text-[#d97d6a] underline font-semibold hover:text-[#c66c5a] transition-colors">
                  Fai una nuova valutazione →
                </button>
              </div>
            </div>
          </section>

          {/* ── CARDS ─────────────────────────────────────────── */}
          <section className="space-y-4">
            <SectionTitle>Card</SectionTitle>

            <div className="space-y-1">
              <Label>Default</Label>
              <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm space-y-1">
                <p className="text-sm font-bold text-gray-900">Appartamento · Via Roma, Modena</p>
                <p className="text-xs text-gray-500">85 m² · 3 locali · 2 bagni · Piano 2</p>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Brand Highlight</Label>
              <div className="p-4 rounded-xl border-2 border-[#e3a692] bg-[#fdf8f6] space-y-1">
                <p className="text-sm font-bold text-gray-900">🎁 Un regalo per te</p>
                <p className="text-xs text-gray-500">La checklist con i 17 documenti per vendere casa.</p>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Social Proof</Label>
              <div className="px-3 py-2 bg-[#fdf8f6] rounded-xl border border-[#e3a692]/20">
                <p className="text-[11px] text-gray-600 text-center">🔥 <span className="font-bold">89+ persone</span> hanno richiesto una valutazione questo mese</p>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Success / Feedback</Label>
              <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#10b981]/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center shrink-0">
                  <Check size={16} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-[#065f46]">Richiesta inviata con successo!</p>
              </div>
            </div>
          </section>

          {/* ── BADGES ────────────────────────────────────────── */}
          <section className="space-y-4">
            <SectionTitle>Badge & Pill</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '🔥 Hot Lead',        bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200' },
                { label: '🌡 Warm Lead',        bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
                { label: '✅ Qualified Lead',   bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
                { label: '❄️ Cold Lead',        bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200' },
                { label: 'Vendere ora',         bg: 'bg-[#fdf8f6]', text: 'text-[#d97d6a]',  border: 'border-[#e3a692]/30' },
              ].map(b => (
                <span key={b.label} className={`px-3 py-1 rounded-full text-xs font-bold border ${b.bg} ${b.text} ${b.border}`}>
                  {b.label}
                </span>
              ))}
            </div>
          </section>

          {/* ── FORM ELEMENTS ─────────────────────────────────── */}
          <section className="space-y-4">
            <SectionTitle>Form</SectionTitle>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Input default</label>
                <input
                  readOnly
                  defaultValue=""
                  placeholder="Es. Via Ciro Menotti 26, Modena"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Input focused</label>
                <input
                  readOnly
                  defaultValue="Via Emilia Est 12, Modena"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e3a692] ring-2 ring-[#e3a692]/20 text-base outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Input error</label>
                <input
                  readOnly
                  defaultValue="abc"
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-400 ring-2 ring-red-100 text-base outline-none"
                />
                <p className="text-xs text-red-500">Campo non valido</p>
              </div>
            </div>
          </section>

          {/* ── SPACING ───────────────────────────────────────── */}
          <section className="space-y-4">
            <SectionTitle>Spaziatura</SectionTitle>
            <div className="space-y-2">
              {[4, 8, 12, 16, 20, 24, 32, 48].map(px => (
                <div key={px} className="flex items-center gap-3">
                  <div className="bg-[#e3a692]/40 rounded" style={{ width: px, height: 16 }} />
                  <span className="text-xs text-gray-500">{px}px</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── BORDER RADIUS ─────────────────────────────────── */}
          <section className="space-y-4">
            <SectionTitle>Border Radius</SectionTitle>
            <div className="flex gap-4 items-end">
              {[
                { label: 'rounded-lg',  r: '8px',  cls: 'rounded-lg' },
                { label: 'rounded-xl',  r: '12px', cls: 'rounded-xl' },
                { label: 'rounded-2xl', r: '16px', cls: 'rounded-2xl' },
                { label: 'rounded-full',r: '∞',    cls: 'rounded-full' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 bg-[#e3a692]/30 border-2 border-[#e3a692] ${b.cls}`} />
                  <p className="text-[10px] text-gray-500 text-center">{b.label}<br/>{b.r}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="pb-8 pt-4 border-t border-gray-100">
            <a href="/" className="text-sm text-[#d97d6a] font-semibold underline">← Torna alla landing</a>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-base font-black text-gray-900 uppercase tracking-wide">{children}</h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{children}</p>;
}
