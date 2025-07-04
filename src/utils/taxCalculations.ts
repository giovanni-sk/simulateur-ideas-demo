// taxCalculations.ts
import { TaxpayerData, TaxCalculationResult, TaxBreakdown, LocationRates } from '../types/tax';

const LOCATION_RATES: LocationRates = {
  'cotonou': { zone: 1, patentFixedRate: 70000, proportionalRate: 17, tfuBuiltRate: 6, tfuNonBuiltRate: 5 },
  'porto-novo': { zone: 1, patentFixedRate: 70000, proportionalRate: 17, tfuBuiltRate: 15, tfuNonBuiltRate: 4 },
  'ouidah': { zone: 1, patentFixedRate: 70000, proportionalRate: 18, tfuBuiltRate: 25, tfuNonBuiltRate: 5 },
  'abomey': { zone: 1, patentFixedRate: 70000, proportionalRate: 14, tfuBuiltRate: 28, tfuNonBuiltRate: 5.6 },
  'parakou': { zone: 2, patentFixedRate: 60000, proportionalRate: 25, tfuBuiltRate: 30, tfuNonBuiltRate: 6 },
  'other-zone1': { zone: 1, patentFixedRate: 70000, proportionalRate: 13, tfuBuiltRate: 15, tfuNonBuiltRate: 4 },
  'other-zone2': { zone: 2, patentFixedRate: 60000, proportionalRate: 15, tfuBuiltRate: 24, tfuNonBuiltRate: 4 }
};

const CCI_BENIN_RATES = [
  { maxRevenue: 5000000, individual: 20000, company: 100000 },
  { maxRevenue: 25000000, individual: 50000, company: 200000 },
  { maxRevenue: 50000000, individual: 150000, company: 300000 },
  { maxRevenue: 400000000, individual: 400000, company: 400000 },
  { maxRevenue: 800000000, individual: 600000, company: 600000 },
  { maxRevenue: 1000000000, individual: 800000, company: 800000 },
  { maxRevenue: 2000000000, individual: 1200000, company: 1200000 },
  { maxRevenue: 4000000000, individual: 1600000, company: 1600000 },
  { maxRevenue: Infinity, individual: 2000000, company: 2000000 }
];

const IMPORT_EXPORT_PATENT_RATES = [
  { maxAmount: 80000000, rate: 150000 },
  { maxAmount: 200000000, rate: 337500 },
  { maxAmount: 500000000, rate: 525000 },
  { maxAmount: 1000000000, rate: 675000 },
  { maxAmount: 2000000000, rate: 900000 },
  { maxAmount: 10000000000, rate: 1125000 },
  { maxAmount: Infinity, rate: 1125000, additionalPerBillion: 10000 }
];

export function calculateTax(data: TaxpayerData): TaxCalculationResult {
  if (!data.taxpayerType || data.revenue < 0) {
    throw new Error('Type de contribuable ou chiffre d\'affaires invalide');
  }

  const breakdown: TaxBreakdown[] = [];
  const details: string[] = [];
  const additionalInfo: string[] = [];
  const regime = data.revenue <= 50000000 ? 'TPS' : 'REEL';

  console.log(`Régime déterminé: ${regime}, CA: ${data.revenue}`);

  return regime === 'TPS'
    ? calculateTPSRegime(data, breakdown, details, additionalInfo)
    : calculateREELRegime(data, breakdown, details, additionalInfo);
}

function calculateTPSRegime(
  data: TaxpayerData,
  breakdown: TaxBreakdown[],
  details: string[],
  additionalInfo: string[]
): TaxCalculationResult {
  let totalTax = 0;

  // TPS: 5% du CA, minimum 10 000 FCFA
  const tpsAmount = Math.max(data.revenue * 0.05, 10000);
  breakdown.push({
    name: 'Taxe Professionnelle Synthétique (TPS)',
    amount: tpsAmount,
    rate: '5%',
    description: 'Taux de 5% appliqué au chiffre d\'affaires (minimum 10,000 FCFA)'
  });
  totalTax += tpsAmount;

  // Redevance audiovisuelle
  const audiovisualFee = 4000;
  breakdown.push({
    name: 'Redevance audiovisuelle',
    amount: audiovisualFee,
    description: 'Redevance obligatoire au profit de l\'ORTB'
  });
  totalTax += audiovisualFee;

  // Cotisation CCI-Bénin
  const cciAmount = calculateCCIBenin(data);
  breakdown.push({
    name: 'Cotisation CCI-Bénin',
    amount: cciAmount,
    description: 'Cotisation à la Chambre de Commerce et d\'Industrie du Bénin'
  });
  totalTax += cciAmount;

  // Taxe Foncière Unique (si applicable)
  if (data.hasProperties && data.propertyDetails) {
    const tfuAmount = calculateTFU(data);
    breakdown.push({
      name: 'Taxe Foncière Unique (TFU)',
      amount: tfuAmount,
      description: 'Taxe sur les propriétés bâties et non bâties'
    });
    totalTax += tfuAmount;
  }

  // Taxe sur les Véhicules à Moteur (si applicable)
  if (data.hasVehicles && data.vehicleDetails) {
    const tvmAmount = calculateTVM(data);
    breakdown.push({
      name: 'Taxe sur les Véhicules à Moteur (TVM)',
      amount: tvmAmount,
      description: 'Taxe sur les véhicules à moteur'
    });
    totalTax += tvmAmount;
  }

  details.push(
    'En tant que personne physique avec un chiffre d\'affaires annuel inférieur à 50 millions FCFA, vous êtes soumis au régime de la TPS.',
    'La TPS regroupe plusieurs impôts : l\'impôt sur les bénéfices d\'affaires (IBA), la contribution des patentes, la contribution des licences et le versement patronal sur les salaires (VPS).'
  );

  additionalInfo.push(
    'Les impôts sont à payer au plus tard le 30 avril suivant l\'année d\'exercice.',
    'Vous devez effectuer deux acomptes prévisionnels les 10 février et 10 juin.',
    'Vous êtes dispensé du paiement de l\'acompte pour la première année d\'activité.',
    'Vous devez tenir une comptabilité simplifiée et conserver les documents pendant 10 ans.'
  );

  console.log(`TPS Total: ${totalTax}`);

  return {
    totalTax,
    breakdown,
    regime: 'TPS',
    details,
    additionalInfo
  };
}

function calculateREELRegime(
  data: TaxpayerData,
  breakdown: TaxBreakdown[],
  details: string[],
  additionalInfo: string[]
): TaxCalculationResult {
  let totalTax = 0;

  if (!data.location) {
    console.warn('Localisation non définie, utilisation de other-zone1 par défaut');
    data.location = 'other-zone1';
  }

  // Patente
  const patentTax = calculatePatentTax(data);
  breakdown.push({
    name: 'Contribution des Patentes',
    amount: patentTax.total,
    description: `Droit fixe: ${patentTax.fixed} FCFA + Droit proportionnel: ${patentTax.proportional} FCFA${patentTax.additional ? ` + Patente supplémentaire: ${patentTax.additional} FCFA` : ''}`
  });
  totalTax += patentTax.total;

  // TVA (information uniquement)
  breakdown.push({
    name: 'TVA (Information)',
    amount: 0,
    rate: '18%',
    description: 'TVA à 18% - Impôt indirect supporté par le consommateur final'
  });

  // Impôt sur les Bénéfices (IBA/IS)
  const incomeTax = calculateIncomeTax(data);
  const taxName = data.taxpayerType === 'entrepreneur-company' ? 'Impôt sur les Sociétés (IS)' : 'Impôt sur les Bénéfices d\'Affaires (IBA)';
  breakdown.push({
    name: taxName,
    amount: incomeTax,
    rate: data.sector === 'education' ? '25%' : '30%',
    description: 'Impôt calculé sur les bénéfices nets avec minimum de perception'
  });
  totalTax += incomeTax;

  // AIB
  const aibAmount = data.revenue * (data.isImporter ? 0.01 : data.sector === 'general' ? 0.01 : 0.03);
  breakdown.push({
    name: 'Acompte sur Impôt assis sur le Bénéfice (AIB)',
    amount: aibAmount,
    rate: data.isImporter || data.sector === 'general' ? '1%' : '3%',
    description: 'Acompte prélevé sur les importations, achats commerciaux ou prestations'
  });
  totalTax += aibAmount;

  // Redevance audiovisuelle
  const audiovisualFee = 4000;
  breakdown.push({
    name: 'Redevance audiovisuelle',
    amount: audiovisualFee,
    description: 'Redevance obligatoire au profit de l\'ORTB'
  });
  totalTax += audiovisualFee;

  // Cotisation CCI-Bénin
  const cciAmount = calculateCCIBenin(data);
  breakdown.push({
    name: 'Cotisation CCI-Bénin',
    amount: cciAmount,
    description: 'Cotisation à la Chambre de Commerce et d\'Industrie du Bénin'
  });
  totalTax += cciAmount;

  // Taxe Foncière Unique (si applicable)
  if (data.hasProperties && data.propertyDetails) {
    const tfuAmount = calculateTFU(data);
    breakdown.push({
      name: 'Taxe Foncière Unique (TFU)',
      amount: tfuAmount,
      description: 'Taxe sur les propriétés bâties et non bâties'
    });
    totalTax += tfuAmount;
  }

  // Taxe sur les Véhicules à Moteur (si applicable)
  if (data.hasVehicles && data.vehicleDetails) {
    const tvmAmount = calculateTVM(data);
    breakdown.push({
      name: 'Taxe sur les Véhicules à Moteur (TVM)',
      amount: tvmAmount,
      description: 'Taxe sur les véhicules à moteur'
    });
    totalTax += tvmAmount;
  }

  details.push(
    'Avec un chiffre d\'affaires supérieur à 50 millions FCFA, vous êtes soumis au régime du réel.',
    'Vous devez déclarer et payer les impôts mensuellement au plus tard le 10 de chaque mois.',
    'La déclaration annuelle doit être déposée au plus tard le 30 avril.'
  );

  additionalInfo.push(
    'Vous devez tenir une comptabilité complète conforme aux normes OHADA.',
    'Les acomptes d\'impôt sur les bénéfices sont payables les 10 mars, juin, septembre et décembre.',
    'Vous devez facturer toutes vos opérations avec des factures normalisées.',
    'Les paiements supérieurs à 100,000 FCFA doivent être effectués par voie bancaire.',
    'Vous devez poser une enseigne professionnelle visible avec votre IFU.'
  );

  console.log(`RÉEL Total: ${totalTax}`);

  return {
    totalTax,
    breakdown,
    regime: 'REEL',
    details,
    additionalInfo
  };
}

function calculatePatentTax(data: TaxpayerData) {
  const location = data.location || 'other-zone1';
  const rates = LOCATION_RATES[location] || LOCATION_RATES['other-zone1'];
  let fixedRight = 0;
  let proportionalRight = 0;
  let additionalPatent = 0;

  // Patente pour importateurs/exportateurs
  if (data.isImporter && data.importExportAmount) {
    fixedRight = IMPORT_EXPORT_PATENT_RATES.reduce((rate, tier) => {
      if (data.importExportAmount! <= tier.maxAmount) {
        return tier.rate + (tier.additionalPerBillion ? Math.ceil((data.importExportAmount! - 10000000000) / 1000000000) * tier.additionalPerBillion : 0);
      }
      return rate;
    }, 0);
  } else {
    // Droit fixe standard
    fixedRight = rates.zone === 1 ? 70000 : 60000;
    if (data.revenue > 1000000000) {
      fixedRight += Math.ceil((data.revenue - 1000000000) / 1000000000) * 10000;
    }
  }

  // Droit proportionnel
  if (data.propertyValue && data.numberOfProperties) {
    proportionalRight = data.propertyValue * (rates.proportionalRate / 100) * data.numberOfProperties;
    proportionalRight = Math.max(proportionalRight, fixedRight / 3);
  }

  // Patente supplémentaire pour marchés publics
  if (data.hasGovernmentContracts && data.contractAmount) {
    additionalPatent = data.contractAmount * 0.005;
  }

  const patentTotal = fixedRight + proportionalRight + additionalPatent;

  console.log(`Patente - Fixe: ${fixedRight}, Proportionnel: ${proportionalRight}, Supplémentaire: ${additionalPatent}, Total: ${patentTotal}`);

  return {
    fixed: fixedRight,
    proportional: proportionalRight,
    additional: additionalPatent,
    total: patentTotal
  };
}

function calculateIncomeTax(data: TaxpayerData) {
  const estimatedProfit = data.revenue * 0.2;
  const isCompany = data.taxpayerType === 'entrepreneur-company';
  const taxRate = data.sector === 'education' ? 0.25 : 0.30;
  let tax = estimatedProfit * taxRate;

  const encashableProducts = data.encashableProducts || (data.revenue * 0.8);
  let minimumTax = isCompany ? 250000 : 500000;

  switch (data.sector) {
    case 'construction':
      minimumTax = Math.max(encashableProducts * 0.03, 500000);
      break;
    case 'real-estate':
      minimumTax = Math.max(encashableProducts * 0.1, 500000);
      break;
    case 'gas-station':
      minimumTax = Math.max(250000, data.revenue * 0.0006);
      break;
    default:
      minimumTax = Math.max(encashableProducts * 0.015, isCompany ? 250000 : 500000);
  }

  const taxAmount = Math.max(tax, minimumTax);

  console.log(`Impôt sur le revenu: Calculé: ${tax}, Minimum: ${minimumTax}, Final: ${taxAmount}`);

  return taxAmount;
}

function calculateCCIBenin(data: TaxpayerData): number {
  // Validation du chiffre d'affaires
  if (typeof data.revenue !== 'number' || data.revenue < 0 || isNaN(data.revenue)) {
    console.error(`Chiffre d'affaires invalide: ${data.revenue}`);
    return 0; // Valeur par défaut en cas d'erreur
  }

  const isCompany = data.taxpayerType === 'entrepreneur-company';
  
  // Recherche de la première tranche correspondante
  const tier = CCI_BENIN_RATES.find((tier) => data.revenue <= tier.maxRevenue);
  
  if (!tier) {
    console.warn(`Aucune tranche CCI-Bénin trouvée pour CA: ${data.revenue}. Utilisation de la tranche par défaut.`);
    return isCompany ? 2000000 : 2000000; // Tranche maximale par défaut
  }

  const amount = isCompany ? tier.company : tier.individual;
  console.log(`CCI-Bénin - CA: ${data.revenue}, Tranche: ${tier.maxRevenue}, Montant: ${amount}, Type: ${isCompany ? 'Société' : 'Individuel'}`);
  
  return amount;
}

function calculateTFU(data: TaxpayerData) {
  if (!data.propertyDetails) return 0;
  return data.propertyDetails.reduce((total, property) => {
    const rates = LOCATION_RATES[property.location] || LOCATION_RATES['other-zone1'];
    const rate = property.isBuilt ? rates.tfuBuiltRate : rates.tfuNonBuiltRate;
    return total + (property.value * (rate / 100));
  }, 0);
}

function calculateTVM(data: TaxpayerData) {
  if (!data.vehicleDetails) return 0;
  return data.vehicleDetails.reduce((total, vehicle) => {
    if (vehicle.isPublic) {
      if (vehicle.type === 'person') {
        if (vehicle.capacity! <= 9) return total + 38000;
        if (vehicle.capacity! <= 20) return total + 57000;
        return total + 86800;
      } else {
        if (vehicle.capacity! <= 2.5) return total + 49500;
        if (vehicle.capacity! <= 5) return total + 57000;
        if (vehicle.capacity! <= 10) return total + 86800;
        return total + 136400;
      }
    } else {
      if (vehicle.power <= 7) return total + 20000;
      if (vehicle.power <= 10) return total + 30000;
      if (vehicle.power <= 15) return total + 40000;
      return total + 60000;
    }
  }, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}