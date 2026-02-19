import React, { useEffect } from 'react';
import { Phone, Download, Check, ArrowRight, Star, RefreshCw, MapPin } from 'lucide-react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    clarity?: (method: string, ...args: any[]) => void;
  }
}

interface ThankYouPageProps {
  firstName: string;
  onNewEvaluation: () => void;
  onDownloadChecklist: () => void;
}

function trackThankYou(eventName: string, metaEvent?: string) {
  window.gtag?.('event', eventName, { event_category: 'Thank You Page' });
  if (metaEvent) window.fbq?.('track', metaEvent);
  window.clarity?.('event', eventName);
}

export default function ThankYouPage({ firstName, onNewEvaluation, onDownloadChecklist }: ThankYouPageProps) {
  const name = firstName.trim() || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-lg mx-auto relative shadow-xl">

      {/* Header */}
      <header className="pt-4 pb-3 flex justify-center border-b border-gray-50 shrink-0">
        <img src="/assets/Logo Diba Nero.png" alt="Logo Diba" className="h-9 w-auto object-contain" />
      </header>

      <main className="flex-1 flex flex-col px-6 pt-8 pb-12 space-y-6">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Success icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#ecfdf5] flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#10b981] flex items-center justify-center shadow-lg shadow-[#10b981]/30">
                <Check size={28} className="text-white" strokeWidth={3} />
              </div>
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full animate-ping bg-[#10b981]/10" style={{ animationDuration: '2s' }} />
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900">
              {name ? `Grazie, ${name}!` : 'Richiesta inviata!'}
            </h1>
            <p className="text-sm text-gray-500">
              Abbiamo ricevuto tutti i dati del tuo immobile.
            </p>
          </div>
        </div>

        {/* ── Urgency banner ───────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-[#fdf8f6] rounded-2xl border border-[#e3a692]/30">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d97d6a] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d97d6a]" />
          </span>
          <p className="text-sm font-semibold text-gray-800">
            Ti ricontattiamo <span className="text-[#d97d6a]">entro 30 minuti</span>
          </p>
        </div>

        {/* ── What happens next ────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Cosa succede adesso</p>
          <div className="space-y-0">
            {[
              {
                icon: <Check size={14} className="text-white" strokeWidth={3} />,
                iconBg: 'bg-[#10b981]',
                title: 'Richiesta ricevuta',
                desc: 'I tuoi dati sono stati salvati nel nostro sistema.',
                status: 'done',
              },
              {
                icon: <span className="text-white text-xs font-bold">2</span>,
                iconBg: 'bg-[#e3a692]',
                title: 'Analisi della tua richiesta',
                desc: 'Il nostro consulente sta valutando la tua proprietà.',
                status: 'active',
              },
              {
                icon: <span className="text-gray-400 text-xs font-bold">3</span>,
                iconBg: 'bg-gray-100',
                title: 'Chiamata con il consulente',
                desc: 'Analizziamo più nel dettaglio le tue richieste e fissiamo un appuntamento per visionare e valutare l\'immobile.',
                status: 'pending',
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                {/* Icon + connector */}
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${step.iconBg} ${step.status === 'active' ? 'shadow-md shadow-[#e3a692]/30' : ''}`}>
                    {step.icon}
                  </div>
                  {i < 2 && <div className="w-px flex-1 bg-gray-100 my-1.5" />}
                </div>
                {/* Text */}
                <div className="pb-5 pt-0.5">
                  <p className={`text-sm font-bold ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {step.title}
                    {step.status === 'active' && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fdf8f6] text-[#d97d6a] border border-[#e3a692]/30">
                        In corso
                      </span>
                    )}
                  </p>
                  <p className={`text-xs mt-0.5 ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-500'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phone + Maps CTA ─────────────────────────────── */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium text-center">
            Hai fretta? Chiamaci tu direttamente o vieni a trovarci in agenzia.
          </p>
          <a
            href="tel:3274911031"
            onClick={() => trackThankYou('phone_call_click', 'Contact')}
            className="flex items-center justify-between w-full px-5 py-4 bg-[#d97d6a] hover:bg-[#c66c5a] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#d97d6a]/30 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold opacity-80 leading-none mb-0.5">Chiama ora</p>
                <p className="text-lg font-black tracking-tight leading-none">327 491 1031</p>
              </div>
            </div>
            <ArrowRight size={20} className="opacity-70" />
          </a>
          <a
            href="https://www.google.com/maps/search/Diba+servizi+immobiliari+reggio+emilia"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackThankYou('maps_click', 'FindLocation')}
            className="flex items-center gap-3 w-full px-5 py-3.5 bg-white border border-gray-200 hover:border-[#e3a692] hover:bg-[#fdf8f6] rounded-2xl transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#fdf8f6] border border-[#e3a692]/30 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-[#d97d6a]" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-semibold text-gray-400 leading-none mb-0.5">Vieni in agenzia</p>
              <p className="text-sm font-bold text-gray-800 leading-tight">Via Vittorio Veneto 3/D, Reggio Emilia 42121</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-gray-300 shrink-0" />
          </a>
        </div>

        {/* ── Checklist card ───────────────────────────────── */}
        <div className="rounded-2xl border-2 border-[#e3a692]/40 bg-[#fdf8f6] p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-sm font-bold text-gray-900">Un regalo per te</p>
              <p className="text-xs text-gray-500 mt-0.5">
                La checklist con i <strong>17 documenti</strong> che ti servono per vendere casa velocemente.
              </p>
            </div>
          </div>
          <a
            href="/assets/Checklist.pdf"
            download
            onClick={onDownloadChecklist}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#d97d6a] hover:bg-[#c66c5a] text-white rounded-xl font-bold text-sm shadow-md shadow-[#d97d6a]/20 transition-all active:scale-[0.98]"
          >
            <Download size={16} />
            Scarica la Checklist PDF
          </a>
        </div>

        {/* ── Social proof ─────────────────────────────────── */}
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={14} className="text-[#e3a692] fill-[#e3a692]" />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center">
            <span className="font-bold text-gray-700">89+ proprietari</span> hanno già ricevuto la loro valutazione questo mese
          </p>
        </div>

        {/* ── New evaluation ───────────────────────────────── */}
        <div className="flex justify-center pt-2">
          <button
            onClick={onNewEvaluation}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#d97d6a] font-medium transition-colors"
          >
            <RefreshCw size={13} />
            Fai una nuova valutazione
          </button>
        </div>

      </main>
    </div>
  );
}
