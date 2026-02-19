
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Clarity from '@microsoft/clarity';
import { ChevronLeft, ChevronRight, Search, Home, Check, MapPin, Loader2, Users, TrendingUp, Download } from 'lucide-react';
import { FormData, PropertyType, EnergyClass, Condition, Motivation } from './types';
import { PROPERTY_TYPES, ENERGY_CLASSES, CONDITION_OPTIONS, MOTIVATION_OPTIONS } from './constants';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';

// Initialize Supabase Client (Client-side)
// Initialize Supabase Client (Client-side)
// Initialize Supabase Client (Client-side)
// Using import.meta.env for Vite native support (works better with Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if we have credentials, otherwise null (prevents crash)
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const LOGO_URL = "/logo.png"; // Local logo file

declare global {
  interface Window {
    _hsq: any[];
    dataLayer: any[];
    fbq: any;
    gtag: any;
    clarity: any;
  }
}

export default function App() {
  if (window.location.pathname === '/privacy-policy') {
    return <PrivacyPolicy />;
  }
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const totalSteps = 4;

  // Helper to track events
  const trackEvent = (eventId: string, value?: any) => {
    // HubSpot
    if (window._hsq) {
      window._hsq.push(['trackEvent', { id: eventId, value }]);
    }
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventId, {
        value: value,
        event_category: 'Lead Generation',
        event_label: `Step ${step}`
      });
    }
    // Meta Pixel
    if (window.fbq) {
      if (eventId === 'valutazione_richiesta') {
        window.fbq('track', 'SubmitApplication');
      } else {
        window.fbq('trackCustom', eventId, { value });
      }
    }
    // Microsoft Clarity
    Clarity.event(eventId);
  };

  const [formData, setFormData] = useState<FormData>({
    address: '',
    propertyType: null,
    surface: '',
    rooms: '',
    bathrooms: '',
    floor: '',
    constructionYear: '',
    constructionYearUnknown: false,
    energyClass: null,
    heatingType: '',
    condition: null,
    hasElevator: null,
    extraSpaces: [],
    extraSpaceDimensions: {},
    motivation: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const STEP_NAMES = ['indirizzo_tipologia', 'dimensioni', 'dettagli', 'motivazione', 'contatti'];

  const updateStepTracking = useCallback((newStep: number) => {
    const stepName = STEP_NAMES[newStep - 1] ?? `step_${newStep}`;
    window.location.hash = `step-${newStep}`;
    Clarity.setTag('funnel_step', stepName);
  }, []);

  const nextStep = useCallback(() => {
    if (step < totalSteps + 1) {
      const stepName = STEP_NAMES[step - 1] ?? `step_${step}`;
      if (window.gtag) {
        window.gtag('event', 'funnel_step_complete', {
          event_category: 'Funnel',
          step_number: step,
          step_name: stepName,
        });
      }
      Clarity.event(`step_${step}_completato`);
      const newStep = step + 1;
      setStep(newStep);
      updateStepTracking(newStep);
      window.scrollTo(0, 0);
    }
  }, [step, totalSteps, updateStepTracking]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      const newStep = step - 1;
      setStep(newStep);
      updateStepTracking(newStep);
      window.scrollTo(0, 0);
    }
  }, [step, updateStepTracking]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!formData.address && !!formData.propertyType;
      case 2: return formData.surface !== '' && formData.rooms !== '' && formData.bathrooms !== '';
      case 3: return formData.floor !== '' && formData.condition !== null && formData.hasElevator !== null;
      case 4: return formData.motivation !== null;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 formData={formData} update={updateFormData} />;
      case 2: return <Step3 formData={formData} update={updateFormData} />;
      case 3: return <StepFloorAndDetails formData={formData} update={updateFormData} />;
      case 4: return <Step7 formData={formData} update={updateFormData} />;
      case 5: return <StepFinal formData={formData} update={updateFormData} trackEvent={trackEvent} onSuccess={() => setIsSuccess(true)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-lg mx-auto relative shadow-xl overflow-hidden">
      {/* Header */}
      <header className="pt-2 pb-2 flex flex-col items-center border-b border-gray-50">
        <div className="mb-2">
          <img src="/assets/Logo Diba Nero.png" alt="Logo Diba" className="h-10 w-auto object-contain" />
        </div>

        {step <= totalSteps && (
          <div className="w-full px-6">
            <div className="flex flex-col items-center">
              {formData.address && step > 1 && step <= totalSteps && (
                <p className="text-xs text-gray-500 mb-4 line-clamp-1">{formData.address}</p>
              )}
              <div className="w-full space-y-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold text-[#d97d6a] animate-pulse">
                    {step === 1 && "Iniziamo!"}
                    {step === 2 && "Ottimo inizio!"}
                    {step === 3 && "Quasi fatto!"}
                    {step === 4 && "Ultimo sforzo!"}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {Math.round((step / totalSteps) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#e3a692] to-[#d97d6a] rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(227,166,146,0.5)]"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium mt-2">
                Passo {step} di {totalSteps}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
        {renderStep()}
      </main>

      {/* Navigation Footer */}
      {!isSuccess && step <= totalSteps + 1 && (
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-100 p-6 flex gap-3 z-50">
          {step > 1 && step <= totalSteps + 1 && (
            <button
              onClick={prevStep}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
              Indietro
            </button>
          )}
          {step <= totalSteps && (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`flex-[1.5] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all shadow-lg shadow-[#e3a692]/20 ${isStepValid() ? 'bg-[#e3a692] hover:bg-[#d97d6a]' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              {step === totalSteps ? 'Completa' : 'Avanti'}
              <ChevronRight size={20} />
            </button>
          )}
        </footer>
      )}
    </div>
  );
}

// --- Steps Components ---

function Step1({ formData, update }: { formData: FormData, update: (u: Partial<FormData>) => void }) {
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=it`
      );
      const data = await res.json();
      const formatted: string[] = data.map((item: any) => {
        const addr = item.address;
        const road = addr.road || addr.pedestrian || addr.path || '';
        const number = addr.house_number || '';
        const city = addr.city || addr.town || addr.village || addr.municipality || '';
        const province = addr.county || '';
        if (road && city) {
          return `${road}${number ? ' ' + number : ''}, ${city}${province ? ', ' + province : ''}`;
        }
        return item.display_name.split(',').slice(0, 3).join(',').trim();
      });
      setSuggestions(formatted);
      setShowSuggestions(formatted.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressChange = (value: string) => {
    update({ address: value });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddress(value), 350);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    update({ address: suggestion });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalizzazione non supportata dal tuo browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.display_name) {
            const address = data.address;
            const street = address.road || '';
            const number = address.house_number || '';
            const city = address.city || address.town || address.village || '';
            const constructedAddress = street ? `${street} ${number}, ${city}` : data.display_name;
            update({ address: constructedAddress });
          }
        } catch (error) {
          console.error("Errore geolocalizzazione:", error);
          alert("Impossibile recuperare l'indirizzo");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Errore posizione:", error);
        setIsLocating(false);
        alert("Impossibile accedere alla tua posizione. Verifica i permessi del browser.");
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Address Section */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">📍 Dove si trova l'immobile?</h2>
          <p className="text-sm text-gray-500">Iniziamo dalla base: dove si trova la tua casa?</p>
        </div>
        <div className="relative" ref={containerRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleAddressChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Es. Via Ciro Menotti 26, Modena"
            autoComplete="off"
            className="w-full pl-12 pr-14 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e3a692]/50 focus:border-[#e3a692] text-base transition-all custom-shadow"
          />
          <button
            onClick={handleGeolocation}
            disabled={isLocating}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#e3a692] hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
            title="Usa la mia posizione attuale"
          >
            {isLocating || isSearching
              ? <Loader2 size={20} className="animate-spin" />
              : <MapPin size={20} />}
          </button>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onMouseDown={() => handleSelectSuggestion(s)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-[#fdf8f6] hover:text-gray-900 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <MapPin size={14} className="text-[#e3a692] shrink-0" />
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Property Type Section (Moved from Step 2) */}
      <div className="space-y-4 pt-4 border-t border-gray-50">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">🏠 Tipologia</h2>
          <p className="text-sm text-gray-500">Ogni casa ha la sua storia, qual è la tua?</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.label}
              onClick={() => update({ propertyType: type.label })}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all gap-1 ${formData.propertyType === type.label
                ? 'border-[#e3a692] bg-[#fdf8f6]'
                : 'border-gray-100 hover:border-gray-200'
                }`}
            >
              <div className={`transition-colors ${formData.propertyType === type.label ? 'text-[#e3a692]' : 'text-gray-400'}`}>
                {type.icon}
              </div>
              <span className={`text-xs font-semibold text-center leading-tight ${formData.propertyType === type.label ? 'text-gray-900' : 'text-gray-600'}`}>
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({ formData, update }: { formData: FormData, update: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">📏 Quanto è grande la casa?</h2>
        <p className="text-sm text-gray-500">Inserisci la superficie e il numero di stanze</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Superficie (m²)</label>
        <input
          type="number"
          value={formData.surface}
          onChange={(e) => update({ surface: e.target.value })}
          placeholder="Es. 85"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e3a692]/50 focus:border-[#e3a692] outline-none text-base"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700">Numero di locali</label>
        <div className="flex gap-2 flex-wrap">
          {['1', '2', '3', '4', '5', '6+'].map(val => (
            <button
              key={val}
              onClick={() => update({ rooms: val })}
              className={`flex-1 min-w-[50px] py-2.5 rounded-xl border-2 font-bold transition-all text-sm ${formData.rooms === val ? 'border-[#e3a692] bg-[#fdf8f6] text-[#e3a692]' : 'border-gray-100 text-gray-600'
                }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700">Numero di bagni</label>
        <div className="flex gap-2 flex-wrap">
          {['1', '2', '3', '4+'].map(val => (
            <button
              key={val}
              onClick={() => update({ bathrooms: val })}
              className={`flex-1 min-w-[60px] py-2.5 rounded-xl border-2 font-bold transition-all text-sm ${formData.bathrooms === val ? 'border-[#e3a692] bg-[#fdf8f6] text-[#e3a692]' : 'border-gray-100 text-gray-600'
                }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepFloorAndDetails({ formData, update }: { formData: FormData, update: (u: Partial<FormData>) => void }) {
  const toggleExtra = (space: string) => {
    const current = formData.extraSpaces;
    if (current.includes(space)) {
      update({ extraSpaces: current.filter(s => s !== space) });
    } else {
      update({ extraSpaces: [...current, space] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Piano */}
      <div className="space-y-2">
        <div className="text-center space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">🏢 Dettagli dell'immobile</h2>
          <p className="text-sm text-gray-500">Piano, condizione e caratteristiche</p>
        </div>
        <label className="text-sm font-bold text-gray-700">A che piano si trova?</label>
        <div className="grid grid-cols-6 gap-2">
          {['Terra', '1', '2', '3', '4', '5+'].map((floor) => (
            <button
              key={floor}
              onClick={() => update({ floor })}
              className={`flex items-center justify-center py-2 rounded-xl border-2 transition-all text-sm font-bold ${formData.floor === floor
                ? 'border-[#e3a692] bg-[#fdf8f6] text-[#e3a692]'
                : 'border-gray-100 hover:border-gray-200 text-gray-600'
                }`}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Condizione */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">In che condizione è la casa?</label>
        <div className="grid grid-cols-2 gap-2">
          {CONDITION_OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => update({ condition: opt.label })}
              className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all ${formData.condition === opt.label ? 'border-[#e3a692] bg-[#fdf8f6]' : 'border-gray-100'
                }`}
            >
              <div className={formData.condition === opt.label ? 'text-[#e3a692]' : 'text-gray-400'}>
                {opt.icon}
              </div>
              <span className={`text-xs font-bold leading-tight ${formData.condition === opt.label ? 'text-gray-900' : 'text-gray-600'}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Ascensore */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">C'è un ascensore?</label>
        <div className="flex gap-2">
          {[true, false].map(val => (
            <button
              key={String(val)}
              onClick={() => update({ hasElevator: val })}
              className={`flex-1 py-2.5 rounded-xl border-2 font-bold transition-all text-sm ${formData.hasElevator === val ? 'border-[#e3a692] bg-[#fdf8f6] text-[#e3a692]' : 'border-gray-100 text-gray-600'
                }`}
            >
              {val ? 'Sì' : 'No'}
            </button>
          ))}
        </div>
      </div>

      {/* Altri spazi - 2 colonne, solo selezionabili */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Altri spazi</label>
        <div className="grid grid-cols-2 gap-2">
          {['Balcone/Terrazzo', 'Cantina/Soffitta', 'Box auto', 'Giardino'].map(space => (
            <button
              key={space}
              onClick={() => toggleExtra(space)}
              className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${formData.extraSpaces.includes(space) ? 'border-[#e3a692] bg-[#fdf8f6]' : 'border-gray-100'
                }`}
            >
              <span className={`text-xs font-semibold ${formData.extraSpaces.includes(space) ? 'text-gray-900' : 'text-gray-600'}`}>{space}</span>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${formData.extraSpaces.includes(space) ? 'bg-[#e3a692] border-[#e3a692]' : 'border-gray-200'
                }`}>
                {formData.extraSpaces.includes(space) && <Check size={10} className="text-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step7({ formData, update }: { formData: FormData, update: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">📅 Quando vorresti vendere:</h2>
        <p className="text-sm text-gray-500">Seleziona la tua tempistica ideale</p>
      </div>

      <div className="space-y-3 mt-8">
        {MOTIVATION_OPTIONS.filter(opt => opt.label !== 'Sono un agente / operatore').map(opt => (
          <div key={opt.label} className="relative">
            <button
              onClick={() => update({ motivation: opt.label })}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden ${formData.motivation === opt.label
                ? 'border-[#e3a692] bg-[#fdf8f6]'
                : opt.label === 'Vendere ora'
                  ? 'border-[#e3a692]/50 bg-orange-50/30'
                  : 'border-gray-100'
                }`}
            >
              <div className={`p-3 rounded-full ${formData.motivation === opt.label ? 'bg-white text-[#e3a692]' : 'bg-gray-50 text-gray-400'}`}>
                {opt.icon}
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-gray-700 block">{opt.label}</span>
                {opt.label === 'Vendere ora' && (
                  <span className="text-[10px] font-bold text-[#e3a692] uppercase tracking-wider mt-0.5 block">
                    Valutazione prioritaria 🚀
                  </span>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepFinal({ formData, update, trackEvent, onSuccess }: { formData: FormData, update: (u: Partial<FormData>) => void, trackEvent: (id: string, value?: any) => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(true);

  // Track page view for final step
  React.useEffect(() => {
    if (window._hsq) {
      window._hsq.push(['setPath', '/valutazione/conferma']);
      window._hsq.push(['trackPageView']);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // HubSpot Tracking: Submit event
    trackEvent('valutazione_richiesta', Number(formData.surface) || 0);

    // --- UTM Tracking: extract from URL params ---
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source") || "";
    const utmMedium = urlParams.get("utm_medium") || "";
    const utmCampaign = urlParams.get("utm_campaign") || "";
    const landingPageUrl = window.location.href;
    const referrerUrl = document.referrer || "";

    // --- Map form values to HubSpot enum values ---
    const motivationMap: Record<string, string> = {
      "Vendere ora": "vendere_ora",
      "Vendere nei prossimi 6 mesi": "entro_6_mesi",
      "Vendere entro 1 anno": "dopo_6_mesi",
      "Conoscere il valore senza vendere": "solo_curiosita",
      "Sono un agente / operatore": "solo_curiosita",
    };

    const propertyTypeMap: Record<string, string> = {
      "Villa indipendente": "villa_indipendente",
      "Attico": "attico",
      "Villetta a schiera": "casa_a_schiera",
      "Appartamento": "appartamento",
      "Loft / Open Space": "appartamento",
      "Mansarda": "appartamento",
    };

    const conditionMap: Record<string, string> = {
      "Nuova costruzione": "nuovo",
      "Ristrutturata": "ottima",
      "Buono abitabile": "buona",
      "Da ristrutturare": "da_ristrutturare",
    };



    const extraSpacesMap: Record<string, string> = {
      "Box auto": "box",
      "Giardino": "giardino",
      "Balcone/Terrazzo": "balcone",
      "Cantina/Soffitta": "cantina",
    };

    // --- Calculate derived values ---
    const surfaceNum = Number(formData.surface) || 0;
    const superficieFascia = surfaceNum >= 120 ? "mq_120_plus" : surfaceNum >= 80 ? "mq_80_119" : surfaceNum >= 60 ? "mq_60_79" : "mq_sotto_60";

    const roomsVal = formData.rooms;
    const numeroLocali = ["4", "5", "6+"].includes(roomsVal) ? "locali_4_plus" : roomsVal === "3" ? "locali_3" : roomsVal === "2" ? "locali_2" : "locali_1";

    const floorVal = formData.floor;
    const hasElev = formData.hasElevator;
    const pianoAscensore =
      ["3", "4", "5+"].includes(floorVal) && hasElev === true ? "piano_alto_con_ascensore" :
        ["3", "4", "5+"].includes(floorVal) && hasElev === false ? "piano_alto_senza_ascensore" :
          floorVal === "Terra" ? "piano_terra" : "piano_intermedio";

    const mappedExtraSpaces = formData.extraSpaces
      .map(s => extraSpacesMap[s] || s.toLowerCase())
      .join(";");

    // --- Lead Score Calculation (0-100) ---
    let leadScore = 0;

    // Motivazione (30 pts)
    const mot = formData.motivation || "";
    if (mot === "Vendere ora") leadScore += 30;
    else if (mot === "Vendere nei prossimi 6 mesi") leadScore += 20;
    else if (mot === "Vendere entro 1 anno") leadScore += 10;
    // "Conoscere il valore senza vendere" and "Sono un agente / operatore" = 0

    // Tipologia (20 pts)
    const pt = formData.propertyType || "";
    if (pt === "Villa indipendente") leadScore += 20;
    else if (pt === "Attico") leadScore += 18;
    else if (pt === "Villetta a schiera") leadScore += 15;
    else if (pt === "Appartamento") leadScore += 12;
    else if (pt === "Loft / Open Space") leadScore += 10;
    else if (pt === "Mansarda") leadScore += 8;

    // Condizione (12 pts)
    const cond = formData.condition || "";
    if (cond === "Nuova costruzione") leadScore += 12;
    else if (cond === "Ristrutturata") leadScore += 10;
    else if (cond === "Buono abitabile") leadScore += 6;
    else if (cond === "Da ristrutturare") leadScore += 2;



    // Superficie (8 pts)
    if (surfaceNum >= 120) leadScore += 8;
    else if (surfaceNum >= 80) leadScore += 6;
    else if (surfaceNum >= 60) leadScore += 4;
    else leadScore += 2;

    // Locali (4 pts)
    if (["4", "5", "6+"].includes(roomsVal)) leadScore += 4;
    else if (roomsVal === "3") leadScore += 3;
    else if (roomsVal === "2") leadScore += 2;
    else if (roomsVal === "1") leadScore += 1;

    // Piano/Ascensore (3 pts)
    if (pianoAscensore === "piano_alto_con_ascensore") leadScore += 3;
    else if (pianoAscensore === "piano_terra" || pianoAscensore === "piano_intermedio") leadScore += 2;

    // Spazi Extra (max 6 pts)
    if (formData.extraSpaces.includes("Box auto")) leadScore += 2;
    if (formData.extraSpaces.includes("Giardino")) leadScore += 2;
    if (formData.extraSpaces.includes("Balcone/Terrazzo")) leadScore += 1;
    if (formData.extraSpaces.includes("Cantina/Soffitta")) leadScore += 1;

    // Cap at 100
    if (leadScore > 100) leadScore = 100;

    // Category
    const leadCategory =
      leadScore >= 80 ? "hot_lead" :
        leadScore >= 60 ? "warm_lead" :
          leadScore >= 40 ? "qualified_lead" : "cold_lead";

    // --- Prepare Payload for Local Email API ---
    const emailPayload = {
      // Contact Info
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,

      // Property Details
      motivation: formData.motivation,
      propertyType: formData.propertyType,
      condition: formData.condition,
      energyClass: formData.energyClass,
      surface: formData.surface,
      rooms: formData.rooms,
      bathrooms: formData.bathrooms, // Added missing field
      floor: formData.floor,
      hasElevator: formData.hasElevator ? "Yes" : "No",
      extraSpaces: formData.extraSpaces.join(", "),

      // Derived Data
      leadScore: leadScore,
      leadCategory: leadCategory,

      // Tracking
      landingPageUrl: window.location.href,
      utmSource: utmSource,
      utmMedium: utmMedium,
      utmCampaign: utmCampaign,
    };

    console.log("📤 Sending email payload:", JSON.stringify(emailPayload, null, 2));

    // --- 1. Save to Supabase (Client-side) ---
    try {
      if (supabase) {
        console.log("💾 Saving to Supabase...");
        const floorNum = formData.floor === 'Terra' ? 0 : parseInt(formData.floor) || 0;
        const { error: dbError } = await supabase
          .from('leads')
          .insert([
            {
              nome: `${formData.firstName} ${formData.lastName}`.trim(),
              email: formData.email,
              telefono: formData.phone,
              indirizzo: formData.address,
              motivazione: formData.motivation,
              tipologia: formData.propertyType,
              condizione: formData.condition,
              classe_energetica: formData.energyClass,
              superficie: Number(formData.surface) || 0,
              locali: parseInt(formData.rooms) || 0,
              bagni: parseInt(formData.bathrooms) || 0,
              piano: floorNum,
              ascensore: formData.hasElevator,
              extra: formData.extraSpaces,
              punteggio: leadScore,
              lead_quality: leadCategory,
              landing_page_url: window.location.href,
              utm_source: utmSource,
              utm_medium: utmMedium,
              utm_campaign: utmCampaign,
              source: referrerUrl || 'direct',
            }
          ]);

        if (dbError) {
          console.error('❌ Supabase Error:', dbError.message, dbError.details, dbError.hint, dbError.code);
        } else {
          console.log('✅ Lead saved to Supabase successfully!');
        }
      } else {
        console.warn("⚠️ Supabase not initialized (missing credentials). Skipping DB save.");
      }
    } catch (dbEx) {
      console.error('❌ Supabase Exception:', dbEx);
    }

    // --- 2. Send Email (via API) ---
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      const rawText = await response.text();
      console.log("📡 Response status:", response.status, "body:", rawText);

      // Handle non-JSON or HTML responses (common in Vite dev)
      if (rawText.trim().startsWith('<')) {
        console.warn("⚠️ API returned HTML instead of JSON. You might be running locally without Vercel Functions.");
        // Treat as "sent" locally to unblock the UI, or throw if strict
        // For now, if we saved to DB, we can consider it a partial success
      } else if (!response.ok) {
        let detail = `HTTP ${response.status}`;
        try {
          const parsed = JSON.parse(rawText);
          detail = parsed.message || parsed.error || parsed.statusCode || detail;
        } catch { }
        throw new Error(String(detail));
      } else {
        console.log("✅ Email sent successfully!");
      }

      if (window.fbq) {
        window.fbq('track', 'CompleteRegistration');
      }
      setLoading(false);
      setSuccess(true);
      onSuccess();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } catch (error: any) {
      console.error("❌ Error sending email:", error);
      setErrorMsg(`Errore: ${error.message || 'Problema di connessione. Riprova.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6 pt-12">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">✅ Perfetto!</h2>
        <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
          Abbiamo ricevuto la tua richiesta.<br />
          Ti chiameremo entro 30 minuti da questo numero
        </p>
        <a href="tel:3274911031" className="text-lg font-bold text-[#e3a692] hover:underline">
          📞 327 491 1031
        </a>
        <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
          Nel frattempo ti ho preparato una <strong>CheckList</strong> di tutta la documentazione che serve per <strong>Vendere velocemente</strong> il tuo immobile
        </p>
        <div className="pt-6 space-y-3 w-full max-w-xs mx-auto">
          {/* Download Checklist Button */}
          <a
            href="/assets/Checklist.pdf"
            download
            onClick={() => trackEvent('checklist_download', { score: 10 })}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#d97d6a] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#c66c5a] hover:scale-105 transition-all transform"
          >
            <Download size={18} />
            Scarica Checklist Vendita 🎁
          </a>

          <button
            onClick={() => { window.location.href = '/'; }}
            className="w-full px-6 py-3 bg-white border-2 border-[#e3a692] text-[#e3a692] rounded-2xl font-bold shadow-lg hover:bg-orange-50 transition-all transform hover:scale-105"
          >
            Nuova Valutazione
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Banner social proof */}
      <div className="px-3 py-2 bg-[#fdf8f6] rounded-xl border border-[#e3a692]/20 text-center">
        <p className="text-[11px] text-gray-600">🔥 <span className="font-bold">89+ persone</span> hanno richiesto una valutazione questo mese</p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">📝 Ultimi Dettagli</h2>
        <p className="text-sm text-gray-500 mb-5">Dove inviamo la tua valutazione personalizzata?</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hidden Fields for HubSpot */}
          <input type="hidden" name="address" value={formData.address} />
          <input type="hidden" name="property_type" value={formData.propertyType || ''} />
          <input type="hidden" name="surface" value={formData.surface} />
          <input type="hidden" name="rooms" value={formData.rooms} />
          <input type="hidden" name="bathrooms" value={formData.bathrooms} />
          <input type="hidden" name="floor" value={formData.floor} />

          <input type="hidden" name="condition" value={formData.condition || ''} />
          <input type="hidden" name="has_elevator" value={formData.hasElevator ? 'Yes' : 'No'} />
          <input type="hidden" name="extra_spaces" value={formData.extraSpaces.join(', ')} />
          <input type="hidden" name="motivation" value={formData.motivation || ''} />

          {/* Lead Scoring Hooks - These fields will be used by HubSpot to score the lead */}
          <input type="hidden" name="hs_lead_score_property_type" value={formData.propertyType === 'Villa indipendente' ? 10 : 5} />
          <input type="hidden" name="hs_lead_score_motivation" value={formData.motivation === 'Vendere ora' ? 10 : 2} />

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Nome</label>
              <input
                required
                name="firstname"
                type="text"
                value={formData.firstName}
                onChange={e => update({ firstName: e.target.value })}
                placeholder="Mario"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e3a692]/50 outline-none"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Cognome</label>
              <input
                required
                name="lastname"
                type="text"
                value={formData.lastName}
                onChange={e => update({ lastName: e.target.value })}
                placeholder="Rossi"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e3a692]/50 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Email</label>
            <input
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={e => update({ email: e.target.value })}
              placeholder="mario.rossi@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e3a692]/50 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Telefono</label>
            <input
              required
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={e => update({ phone: e.target.value })}
              placeholder="+39 333 123 4567"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e3a692]/50 outline-none"
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#e3a692] focus:ring-[#e3a692] shrink-0"
            />
            <span className="text-[11px] text-gray-500 leading-relaxed">
              Ho letto e accetto la <a href="/privacy-policy" target="_blank" className="text-[#d97d6a] underline font-semibold">Privacy Policy</a> e autorizzo il trattamento dei miei dati personali ai sensi del GDPR (Reg. UE 2016/679).
            </span>
          </label>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !privacyAccepted}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${loading || !privacyAccepted ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#d97d6a] hover:bg-[#c66c5a]'
              }`}
          >
            {loading ? 'Elaborazione...' : 'Richiedi gratis'}
          </button>
        </form>
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto shadow-xl">
      <header className="pt-4 pb-4 flex flex-col items-center border-b border-gray-100">
        <a href="/">
          <img src="/assets/Logo Diba Nero.png" alt="Logo Diba" className="h-10 w-auto object-contain" />
        </a>
      </header>

      <main className="px-6 py-8 space-y-6">
        <h1 className="text-2xl font-black text-gray-900">Privacy Policy</h1>
        <p className="text-xs text-gray-400">Ultimo aggiornamento: Febbraio 2026</p>

        <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">1. Titolare del Trattamento</h2>
            <p>
              Il Titolare del trattamento dei dati personali è <strong>Diba Real Estate</strong>, con sede in Italia.
              Per qualsiasi richiesta relativa alla privacy è possibile contattarci all'indirizzo email: <a href="mailto:info@dibare.it" className="text-[#d97d6a] underline font-semibold">info@dibare.it</a>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">2. Dati Raccolti</h2>
            <p>Attraverso il modulo di valutazione immobiliare raccogliamo i seguenti dati:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dati di contatto:</strong> nome, cognome, email, telefono</li>
              <li><strong>Dati dell'immobile:</strong> indirizzo, tipologia, superficie, numero locali, piano, condizione, spazi extra</li>
              <li><strong>Dati di navigazione:</strong> URL di provenienza, parametri UTM, pagina di atterraggio</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">3. Finalità del Trattamento</h2>
            <p>I dati personali sono trattati per le seguenti finalità:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fornitura del servizio di valutazione immobiliare gratuita</li>
              <li>Contatto telefonico o via email per comunicare la valutazione</li>
              <li>Miglioramento dei nostri servizi e analisi statistiche aggregate</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">4. Base Giuridica</h2>
            <p>
              Il trattamento dei dati si basa sul <strong>consenso esplicito</strong> dell'utente (Art. 6, par. 1, lett. a del GDPR)
              e sull'<strong>esecuzione di misure precontrattuali</strong> (Art. 6, par. 1, lett. b del GDPR).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">5. Conservazione dei Dati</h2>
            <p>
              I dati personali saranno conservati per un periodo massimo di <strong>24 mesi</strong> dalla raccolta,
              salvo diversa richiesta dell'interessato.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">6. Condivisione dei Dati</h2>
            <p>I dati possono essere condivisi con:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase Inc.</strong> — per l'archiviazione sicura dei dati (server UE)</li>
              <li><strong>Vercel Inc.</strong> — per l'hosting del sito web</li>
              <li><strong>Resend</strong> — per l'invio di email transazionali</li>
            </ul>
            <p>I dati <strong>non vengono venduti</strong> a terzi per finalità di marketing.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">7. Diritti dell'Interessato</h2>
            <p>Ai sensi degli articoli 15-22 del GDPR, hai diritto a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Accedere ai tuoi dati personali</li>
              <li>Rettificare dati inesatti o incompleti</li>
              <li>Richiedere la cancellazione dei dati</li>
              <li>Limitare il trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Opporti al trattamento</li>
              <li>Revocare il consenso in qualsiasi momento</li>
            </ul>
            <p>
              Per esercitare questi diritti, contattaci a: <a href="mailto:info@dibare.it" className="text-[#d97d6a] underline font-semibold">info@dibare.it</a>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">8. Cookie</h2>
            <p>
              Il sito utilizza cookie tecnici necessari al funzionamento e cookie analitici di terze parti
              (Google Analytics, Meta Pixel) per analisi statistiche anonime. Puoi gestire le preferenze
              cookie attraverso le impostazioni del tuo browser.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">9. Sicurezza</h2>
            <p>
              Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da
              accessi non autorizzati, perdita o distruzione. Tutte le comunicazioni avvengono tramite
              protocollo HTTPS crittografato.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-800">10. Contatti</h2>
            <p>
              Per domande o richieste relative alla presente Privacy Policy:<br />
              <strong>Diba Real Estate</strong><br />
              Email: <a href="mailto:info@dibare.it" className="text-[#d97d6a] underline font-semibold">info@dibare.it</a><br />
              Tel: <a href="tel:3274911031" className="text-[#d97d6a] underline font-semibold">327 491 1031</a>
            </p>
          </section>
        </div>

        <div className="pt-6 pb-8">
          <a
            href="/"
            className="flex items-center justify-center w-full py-3 bg-[#d97d6a] text-white rounded-xl font-bold hover:bg-[#c66c5a] transition-all"
          >
            ← Torna alla valutazione
          </a>
        </div>
      </main>
    </div>
  );
}
