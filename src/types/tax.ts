// tax.ts
export interface TaxpayerData {
  taxpayerType: 'entrepreneur-individual' | 'entrepreneur-company' | 'individual' | '';
  revenue: number;
  location?: string;
  propertyValue?: number;
  numberOfProperties?: number;
  isImporter?: boolean;
  importExportAmount?: number;
  hasGovernmentContracts?: boolean;
  contractAmount?: number;
  sector?: 'general' | 'construction' | 'real-estate' | 'gas-station' | 'education';
  encashableProducts?: number;
  hasProperties?: boolean; // Pour TFU
  propertyDetails?: { location: string; value: number; isBuilt: boolean }[]; // Détails des propriétés
  hasVehicles?: boolean; // Pour TVM
  vehicleDetails?: { type: string; power: number; isPublic: boolean; capacity?: number }[]; // Détails des véhicules
}

export interface TaxCalculationResult {
  totalTax: number;
  breakdown: TaxBreakdown[];
  regime: 'TPS' | ' REEL';
  details: string[];
  additionalInfo: string[];
}

export interface TaxBreakdown {
  name: string;
  amount: number;
  rate?: string;
  description: string;
}

export interface LocationRates {
  [key: string]: {
    zone: number;
    patentFixedRate: number;
    proportionalRate: number;
    tfuBuiltRate: number; // Taux TFU pour propriétés bâties
    tfuNonBuiltRate: number; // Taux TFU pour propriétés non bâties
  };
}