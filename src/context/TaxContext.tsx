// TaxContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TaxpayerData, TaxCalculationResult } from '../types/tax';
import { calculateTax } from '../utils/taxCalculations';

interface TaxContextType {
  taxpayerData: TaxpayerData;
  calculationResult: TaxCalculationResult | null;
  updateTaxpayerData: (data: Partial<TaxpayerData>) => void;
  calculateTaxes: () => void;
  resetData: () => void;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

const initialTaxpayerData: TaxpayerData = {
  taxpayerType: '',
  revenue: 0,
  location: '',
  propertyValue: 0,
  numberOfProperties: 1,
  isImporter: false,
  importExportAmount: 0,
  hasGovernmentContracts: false,
  contractAmount: 0,
  sector: 'general',
  encashableProducts: 0,
  hasProperties: false,
  propertyDetails: [],
  hasVehicles: false,
  vehicleDetails: []
};

export function TaxProvider({ children }: { children: ReactNode }) {
  const [taxpayerData, setTaxpayerData] = useState<TaxpayerData>(initialTaxpayerData);
  const [calculationResult, setCalculationResult] = useState<TaxCalculationResult | null>(null);

  const updateTaxpayerData = (data: Partial<TaxpayerData>) => {
    setTaxpayerData((prev) => ({ ...prev, ...data }));
  };

  const calculateTaxes = () => {
    try {
      const result = calculateTax(taxpayerData);
      setCalculationResult(result);
    } catch (error) {
      console.error('Erreur lors du calcul des impôts:', error);
      setCalculationResult(null);
    }
  };

  const resetData = () => {
    setTaxpayerData(initialTaxpayerData);
    setCalculationResult(null);
  };

  useEffect(() => {
    if (taxpayerData.revenue > 0 && taxpayerData.taxpayerType) {
      calculateTaxes();
    }
  }, [taxpayerData]);

  return (
    <TaxContext.Provider value={{
      taxpayerData,
      calculationResult,
      updateTaxpayerData,
      calculateTaxes,
      resetData
    }}>
      {children}
    </TaxContext.Provider>
  );
}

export function useTax() {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error('useTax doit être utilisé dans un TaxProvider');
  }
  return context;
}