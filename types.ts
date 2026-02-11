
export type PropertyType =
  | 'Appartamento'
  | 'Villa indipendente'
  | 'Loft / Open Space'
  | 'Mansarda'
  | 'Attico'
  | 'Villetta a schiera';

export type EnergyClass = 'A4' | 'A3' | 'A2' | 'A1' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'Non lo so';

export type Condition = 'Da ristrutturare' | 'Buono abitabile' | 'Ristrutturata' | 'Nuova costruzione';

export type Motivation =
  | 'Vendere ora'
  | 'Vendere nei prossimi 6 mesi'
  | 'Vendere entro 1 anno'
  | 'Conoscere il valore senza vendere'
  | 'Sono un agente / operatore';

export interface FormData {
  address: string;
  propertyType: PropertyType | null;
  surface: string;
  rooms: string;
  bathrooms: string;
  floor: string;
  constructionYear: string;
  energyClass: EnergyClass | null;
  heatingType: string;
  condition: Condition | null;
  hasElevator: boolean | null;
  extraSpaces: string[];
  extraSpaceDimensions: Record<string, string>;
  constructionYearUnknown: boolean;
  motivation: Motivation | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
