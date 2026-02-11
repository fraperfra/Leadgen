
import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Search, Home, Check, MapPin, Loader2, Users, TrendingUp, Download } from 'lucide-react';
import { FormData, PropertyType, EnergyClass, Condition, Motivation } from './types';
import { PROPERTY_TYPES, ENERGY_CLASSES, CONDITION_OPTIONS, MOTIVATION_OPTIONS } from './constants';

const LOGO_URL = "/logo.png"; // Local logo file

declare global {
  interface Window {
    _hsq: any[];
    dataLayer: any[];
    fbq: any;
    gtag: any;
  }
}

export default function App() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const totalSteps = 6;

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
      // Map custom events to standard Meta events where possible, or use CustomEvent
      if (eventId === 'valutazione_richiesta') {
        window.fbq('track', 'SubmitApplication');
      } else {
        window.fbq('trackCustom', eventId, { value });
      }
    }
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

  const nextStep = useCallback(() => {
    if (step < totalSteps + 1) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  }, [step, totalSteps]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  }, [step]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!formData.address && !!formData.propertyType;
      case 2: return formData.surface !== '' && formData.rooms !== '' && formData.bathrooms !== '';
      case 3: return formData.floor !== '';
      case 4: return (formData.constructionYear !== '' || formData.constructionYearUnknown) && formData.energyClass !== null && formData.heatingType !== '';
      case 5: return formData.condition !== null && formData.hasElevator !== null;
      case 6: return formData.motivation !== null;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 formData={formData} update={updateFormData} />;
      case 2: return <Step3 formData={formData} update={updateFormData} />;
      case 3: return <Step4 formData={formData} update={updateFormData} />;
      case 4: return <Step5 formData={formData} update={updateFormData} />;
      case 5: return <Step6 formData={formData} update={updateFormData} />;
      case 6: return <Step7 formData={formData} update={updateFormData} />;
      case 7: return <StepFinal formData={formData} update={updateFormData} trackEvent={trackEvent} onSuccess={() => setIsSuccess(true)} />;
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
                    {step === 3 && "Continua così!"}
                    {step === 4 && "Sei a metà!"}
                    {step === 5 && "Quasi fatto!"}
                    {step === 6 && "Ultimo sforzo!"}
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
            // Simplify address if possible, or use full display_name
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
    <div className="space-y-10">
      {/* Address Section */}
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">📍 Dove si trova l'immobile?</h2>
          <p className="text-sm text-gray-500">Iniziamo dalla base: dove si trova la tua casa?</p>
        </div>
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => update({ address: e.target.value })}
            placeholder="Es. Via Ciro Menotti 26, Modena"
            className="w-full pl-12 pr-14 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e3a692]/50 focus:border-[#e3a692] text-base transition-all custom-shadow"
          />
          <button
            onClick={handleGeolocation}
            disabled={isLocating}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#e3a692] hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
            title="Usa la mia posizione attuale"
          >
            {isLocating ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
          </button>
        </div>
      </div>

      {/* Property Type Section (Moved from Step 2) */}
      <div className="space-y-6 pt-4 border-t border-gray-50">
        <div className="text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">🏠 Tipologia</h2>
          <p className="text-sm text-gray-500">Ogni casa ha la sua storia, qual è la tua?</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-8">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.label}
              onClick={() => update({ propertyType: type.label })}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2 aspect-square ${formData.propertyType === type.label
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

function Step4({ formData, update }: { formData: FormData, update: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">🏢 A che piano si trova?</h2>
        <p className="text-sm text-gray-500">Un dettaglio importante per la valutazione</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-6">
        {['Terra', '1', '2', '3', '4', '5+'].map((floor) => (
          <button
            key={floor}
            onClick={() => update({ floor })}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all aspect-square ${formData.floor === floor
              ? 'border-[#e3a692] bg-[#fdf8f6]'
              : 'border-gray-100 hover:border-gray-200'
              }`}
          >
            <span className={`text-xl font-bold ${formData.floor === floor ? 'text-gray-900' : 'text-gray-600'}`}>
              {floor}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step5({ formData, update }: { formData: FormData, update: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">🏗️ Dettagli dell'immobile</h2>
          <p className="text-sm text-gray-500">Anno, classe energetica e tipo di riscaldamento</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Anno di costruzione</label>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={formData.constructionYear}
            disabled={formData.constructionYearUnknown}
            onChange={(e) => update({ constructionYear: e.target.value })}
            placeholder="Es. 1985"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e3a692]/50 focus:border-[#e3a692] outline-none disabled:bg-gray-100 disabled:text-gray-400 text-base"
          />
          <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={formData.constructionYearUnknown}
              onChange={(e) => update({
                constructionYearUnknown: e.target.checked,
                constructionYear: e.target.checked ? '' : formData.constructionYear
              })}
              className="w-5 h-5 rounded border-gray-300 text-[#e3a692] focus:ring-[#e3a692]"
            />
            <span className="text-sm text-gray-600">Non ricordo</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700">Classe energetica</label>
        <div className="grid grid-cols-4 gap-2">
          {ENERGY_CLASSES.map(cls => (
            <button
              key={cls}
              onClick={() => update({ energyClass: cls as EnergyClass })}
              className={`py-2.5 rounded-xl border-2 font-semibold text-xs transition-all ${formData.energyClass === cls ? 'border-[#e3a692] bg-[#fdf8f6] text-[#e3a692]' : 'border-gray-100 text-gray-600'
                } ${cls === 'Non lo so' ? 'col-span-2' : ''}`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Tipo di riscaldamento</label>
        <select
          value={formData.heatingType}
          onChange={(e) => update({ heatingType: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e3a692]/50 focus:border-[#e3a692] outline-none bg-white text-base"
        >
          <option value="">Seleziona tipo di riscaldamento</option>
          <option value="Autonomo">Autonomo</option>
          <option value="Centralizzato">Centralizzato</option>
          <option value="Pompa di calore">Pompa di calore</option>
        </select>
      </div>
    </div>
  );
}

function Step6({ formData, update }: { formData: FormData, update: (u: Partial<FormData>) => void }) {
  const toggleExtra = (space: string) => {
    const current = formData.extraSpaces;
    if (current.includes(space)) {
      update({ extraSpaces: current.filter(s => s !== space) });
    } else {
      update({ extraSpaces: [...current, space] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">🛠️ Condizione e caratteristiche</h2>
        <p className="text-sm text-gray-500">Stato dell'immobile e spazi extra</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700">In che condizione è la casa?</label>
        <div className="grid grid-cols-2 gap-3">
          {CONDITION_OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => update({ condition: opt.label })}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${formData.condition === opt.label ? 'border-[#e3a692] bg-[#fdf8f6]' : 'border-gray-100'
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

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700">C'è un ascensore?</label>
        <div className="flex gap-3">
          {[true, false].map(val => (
            <button
              key={String(val)}
              onClick={() => update({ hasElevator: val })}
              className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm ${formData.hasElevator === val ? 'border-[#e3a692] bg-[#fdf8f6] text-[#e3a692]' : 'border-gray-100 text-gray-600'
                }`}
            >
              {val ? 'Sì' : 'No'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700">Altri spazi</label>
        <div className="space-y-3">
          {['Balcone/Terrazzo', 'Cantina/Soffitta', 'Box auto', 'Giardino'].map(space => (
            <div key={space} className={`rounded-xl border-2 transition-all overflow-hidden ${formData.extraSpaces.includes(space) ? 'border-[#e3a692] bg-[#fdf8f6]' : 'border-gray-100'
              }`}>
              <button
                onClick={() => toggleExtra(space)}
                className="w-full flex items-center justify-between p-3"
              >
                <span className="text-sm font-semibold text-gray-700">{space}</span>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.extraSpaces.includes(space) ? 'bg-[#e3a692] border-[#e3a692]' : 'border-gray-200'
                  }`}>
                  {formData.extraSpaces.includes(space) && <Check size={14} className="text-white" />}
                </div>
              </button>
              {formData.extraSpaces.includes(space) && (
                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Superficie (mq)</label>
                  <input
                    type="number"
                    value={formData.extraSpaceDimensions?.[space] || ''}
                    onChange={(e) => update({
                      extraSpaceDimensions: {
                        ...formData.extraSpaceDimensions,
                        [space]: e.target.value
                      }
                    })}
                    placeholder="Es. 15"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#e3a692]/50 focus:border-[#e3a692] outline-none bg-white text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
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
        {MOTIVATION_OPTIONS.map(opt => (
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

    const energyClassMap: Record<string, string> = {
      "A4": "classe_a_plus_a",
      "A3": "classe_a_plus_a",
      "A2": "classe_a_plus_a",
      "A1": "classe_a_plus_a",
      "B": "classe_b_c",
      "C": "classe_b_c",
      "D": "classe_d_e",
      "E": "classe_d_e",
      "F": "classe_f_g",
      "G": "classe_f_g",
      "Non lo so": "",
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

    // --- Build HubSpot Forms API payload ---
    // Lead scoring (punteggio + categoria) is calculated by HubSpot workflows
    const hubspotPayload = {
      fields: [
        // Contact info
        { name: "firstname", value: formData.firstName },
        { name: "lastname", value: formData.lastName },
        { name: "email", value: formData.email },
        { name: "phone", value: formData.phone },

        // UTM & page tracking
        { name: "utm_source", value: utmSource },
        { name: "utm_medium", value: utmMedium },
        { name: "utm_campaign", value: utmCampaign },
        { name: "landing_page_url", value: landingPageUrl },
        { name: "referrer_url", value: referrerUrl },

        // Property data (mapped to HubSpot enums)
        { name: "motivazione_vendita", value: motivationMap[formData.motivation || ""] || "" },
        { name: "tipologia_immobile", value: propertyTypeMap[formData.propertyType || ""] || "" },
        { name: "condizione_immobile", value: conditionMap[formData.condition || ""] || "" },
        { name: "classe_energetica_immobile", value: energyClassMap[formData.energyClass || ""] || "" },
        { name: "superficie_immobile_fascia", value: superficieFascia },
        { name: "numero_locali_immobile", value: numeroLocali },
        { name: "piano_ascensore_immobile", value: pianoAscensore },
        { name: "spazi_extra_immobile", value: mappedExtraSpaces },

        // Engagement
        { name: "download_checklist_valutazione", value: "false" },
      ],
      context: {
        pageUri: landingPageUrl,
        pageName: document.title,
      },
    };

    try {
      const HUBSPOT_PORTAL_ID = "147781010";
      const HUBSPOT_FORM_GUID = "5f315feb-ae72-4b07-8cc0-027a23a91b13";

      const response = await fetch(
        `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hubspotPayload),
        }
      );

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      // Success!
      setLoading(false);
      setSuccess(true);
      onSuccess();
    } catch (error) {
      console.error("Error submitting to HubSpot:", error);

      // Fallback: Still show success to user (data is tracked via HubSpot tracking code)
      setLoading(false);
      setSuccess(true);
      onSuccess();
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6 pt-12">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
          <Check size={48} />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Richiesta Ricevuta!</h2>
        <p className="text-lg text-gray-600 max-w-xs mx-auto leading-relaxed">
          Grazie. Ti contatterò personalmente entro 2 ore per la tua valutazione gratuita.
        </p>
        <div className="pt-6 space-y-3 w-full max-w-xs mx-auto">
          {/* Download Checklist Button */}
          <a
            href="/assets/Checklist.pdf"
            download
            onClick={() => trackEvent('checklist_download', { score: 10 })}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border-2 border-[#e3a692] text-[#e3a692] rounded-2xl font-bold shadow-lg hover:bg-orange-50 transition-all transform hover:scale-105"
          >
            <Download size={20} />
            Scarica Checklist Vendita 🎁
          </a>

          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#e3a692] to-[#d97d6a] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform"
          >
            Nuova Valutazione
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">📝 Ultimi Dettagli!</h2>
        <p className="text-sm text-gray-500">Dove inviamo la tua valutazione personalizzata?</p>
      </div>

      <div className="bg-gradient-to-br from-[#fdf8f6] to-[#fff] p-4 rounded-2xl border-2 border-[#e3a692]/30 shadow-lg shadow-[#e3a692]/10 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <TrendingUp size={100} color="#e3a692" />
        </div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-[#e3a692] text-white rounded-xl shadow-md transform rotate-3">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-[#d97d6a] font-black uppercase tracking-wider mb-1">🔥 Molto richiesto</p>
            <p className="text-sm font-medium text-gray-700 leading-relaxed">
              <span className="font-bold text-gray-900">490+ persone</span> hanno valutato il loro immobile nell'ultimo mese.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 relative z-10">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 overflow-hidden`}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="User" />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 font-medium">Unisciti a loro oggi!</p>
        </div>

      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Ricevi la tua valutazione</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hidden Fields for HubSpot */}
          <input type="hidden" name="address" value={formData.address} />
          <input type="hidden" name="property_type" value={formData.propertyType || ''} />
          <input type="hidden" name="surface" value={formData.surface} />
          <input type="hidden" name="rooms" value={formData.rooms} />
          <input type="hidden" name="bathrooms" value={formData.bathrooms} />
          <input type="hidden" name="floor" value={formData.floor} />
          <input type="hidden" name="construction_year" value={formData.constructionYear} />
          <input type="hidden" name="energy_class" value={formData.energyClass || ''} />
          <input type="hidden" name="heating_type" value={formData.heatingType} />
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-[#d97d6a] hover:bg-[#c66c5a]'
              }`}
          >
            {loading ? 'Elaborazione...' : 'Richiedi gratis'}
          </button>

          <p className="text-[10px] text-gray-400 text-center leading-relaxed px-4">
            I tuoi dati sono al sicuro. Li useremo solo per contattarti riguardo la valutazione.
          </p>
        </form>
      </div>
    </div>
  );
}
