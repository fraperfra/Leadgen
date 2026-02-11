
import React from 'react';
import { 
  Building2, 
  Home, 
  Warehouse, 
  ArrowUp, 
  Layout, 
  Rows,
  Hammer,
  CheckCircle2,
  Zap,
  Sparkles,
  TrendingUp,
  Clock,
  Calendar,
  Search,
  Briefcase
} from 'lucide-react';
import { PropertyType, Motivation, Condition } from './types';

export const PROPERTY_TYPES: { label: PropertyType; icon: React.ReactNode }[] = [
  { label: 'Appartamento', icon: <Building2 className="w-8 h-8" /> },
  { label: 'Villa indipendente', icon: <Home className="w-8 h-8" /> },
  { label: 'Loft / Open Space', icon: <Warehouse className="w-8 h-8" /> },
  { label: 'Mansarda', icon: <ArrowUp className="w-8 h-8" /> },
  { label: 'Attico', icon: <Layout className="w-8 h-8" /> },
  { label: 'Villetta a schiera', icon: <Rows className="w-8 h-8" /> },
];

export const CONDITION_OPTIONS: { label: Condition; icon: React.ReactNode }[] = [
  { label: 'Da ristrutturare', icon: <Hammer className="w-5 h-5" /> },
  { label: 'Buono abitabile', icon: <CheckCircle2 className="w-5 h-5" /> },
  { label: 'Ristrutturata', icon: <Zap className="w-5 h-5" /> },
  { label: 'Nuova costruzione', icon: <Sparkles className="w-5 h-5" /> },
];

export const MOTIVATION_OPTIONS: { label: Motivation; icon: React.ReactNode }[] = [
  { label: 'Vendere ora', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Vendere nei prossimi 6 mesi', icon: <Clock className="w-5 h-5" /> },
  { label: 'Vendere entro 1 anno', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Conoscere il valore senza vendere', icon: <Search className="w-5 h-5" /> },
  { label: 'Sono un agente / operatore', icon: <Briefcase className="w-5 h-5" /> },
];

export const ENERGY_CLASSES: string[] = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G', 'Non lo so'];
