// Revenue.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InfoNotice from '../components/InfoNotice';
import Button from '../components/Button';
import { useTax } from '../context/TaxContext';
import type { TaxpayerData } from '../types/tax';

const Revenue: React.FC = () => {
  const navigate = useNavigate();
  const { taxpayerData, updateTaxpayerData, calculateTaxes } = useTax();
  const [formData, setFormData] = useState({
    revenue: taxpayerData.revenue.toString(),
    location: taxpayerData.location || '',
    propertyValue: taxpayerData.propertyValue?.toString() || '',
    numberOfProperties: taxpayerData.numberOfProperties?.toString() || '1',
    sector: taxpayerData.sector || 'general',
    hasGovernmentContracts: taxpayerData.hasGovernmentContracts || false,
    contractAmount: taxpayerData.contractAmount?.toString() || '',
    isImporter: taxpayerData.isImporter || false,
    importExportAmount: taxpayerData.importExportAmount?.toString() || '',
    hasProperties: taxpayerData.hasProperties || false,
    hasVehicles: taxpayerData.hasVehicles || false,
    propertyDetails: taxpayerData.propertyDetails || [],
    vehicleDetails: taxpayerData.vehicleDetails || []
  });

  const isReelRegime = parseFloat(formData.revenue) > 50000000;

  const isFormValid = () => {
    const revenue = parseFloat(formData.revenue);
    if (!revenue || revenue < 0) return false;
    if (isReelRegime) {
      if (!formData.location) return false;
      if (formData.hasGovernmentContracts && (!formData.contractAmount || parseFloat(formData.contractAmount) < 0)) return false;
      if (formData.isImporter && (!formData.importExportAmount || parseFloat(formData.importExportAmount) < 0)) return false;
      if (formData.hasProperties && formData.propertyDetails.length === 0) return false;
      if (formData.hasVehicles && formData.vehicleDetails.length === 0) return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires correctement.');
      return;
    }

    const updatedData: Partial<TaxpayerData> = {
      revenue: parseFloat(formData.revenue) || 0,
      location: formData.location,
      propertyValue: parseFloat(formData.propertyValue) || 0,
      numberOfProperties: parseInt(formData.numberOfProperties) || 1,
      sector: formData.sector,
      hasGovernmentContracts: formData.hasGovernmentContracts,
      contractAmount: parseFloat(formData.contractAmount) || 0,
      isImporter: formData.isImporter,
      importExportAmount: parseFloat(formData.importExportAmount) || 0,
      hasProperties: formData.hasProperties,
      propertyDetails: formData.propertyDetails,
      hasVehicles: formData.hasVehicles,
      vehicleDetails: formData.vehicleDetails
    };

    updateTaxpayerData(updatedData);
    calculateTaxes();
    navigate('/results');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addProperty = () => {
    setFormData(prev => ({
      ...prev,
      propertyDetails: [...prev.propertyDetails, { location: '', value: 0, isBuilt: true }]
    }));
  };

  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicleDetails: [...prev.vehicleDetails, { type: 'person', power: 0, isPublic: false, capacity: 0 }]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Données du contribuable</h2>
          <p className="text-gray-600 mb-8">Complétez les informations pour calculer vos impôts</p>
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="bg-[#006B6B] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
                    Type de contribuable
                  </h3>
                  <h4 className="text-[#006B6B] font-medium mb-2">
                    {taxpayerData.taxpayerType === 'entrepreneur-individual' && 'Personne physique - entreprises individuelles'}
                    {taxpayerData.taxpayerType === 'entrepreneur-company' && 'Entrepreneur - Personne morale'}
                    {taxpayerData.taxpayerType === 'individual' && 'Contribuable individuel'}
                  </h4>
                  <InfoNotice title="Régimes fiscaux applicables">
                    <div className="space-y-2">
                      <p className="font-medium">
                        {isReelRegime ? 'Régime du RÉEL' : 'Régime de la TPS'}
                      </p>
                      <p className="text-sm">
                        {isReelRegime
                          ? 'Chiffre d\'affaires > 50 millions FCFA - Régime complet avec TVA, patente, et impôt sur les bénéfices.'
                          : 'Chiffre d\'affaires ≤ 50 millions FCFA - Taxe professionnelle synthétique de 5%.'
                        }
                      </p>
                    </div>
                  </InfoNotice>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="bg-[#006B6B] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">2</span>
                    Informations financières
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="revenue" className="block text-gray-700 mb-2 font-medium">
                        Chiffre d'affaires annuel (FCFA) *
                      </label>
                      <input
                        type="number"
                        id="revenue"
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#006B6B] focus:border-[#006B6B]"
                        placeholder="ex: 45000000"
                        value={formData.revenue}
                        onChange={(e) => handleInputChange('revenue', e.target.value)}
                        required
                        min="0"
                      />
                    </div>
                    {isReelRegime && (
                      <>
                        <div>
                          <label htmlFor="location" className="block text-gray-700 mb-2 font-medium">
                            Localisation de l'entreprise *
                          </label>
                          <select
                            id="location"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#006B6B] focus:border-[#006B6B]"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            required
                          >
                            <option value="">Sélectionnez votre ville</option>
                            <option value="cotonou">Cotonou</option>
                            <option value="porto-novo">Porto-Novo</option>
                            <option value="ouidah">Ouidah</option>
                            <option value="abomey">Abomey</option>
                            <option value="parakou">Parakou</option>
                            <option value="other-zone1">Autre (Zone 1)</option>
                            <option value="other-zone2">Autre (Zone 2)</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="propertyValue" className="block text-gray-700 mb-2 font-medium">
                            Valeur locative des locaux professionnels (FCFA)
                          </label>
                          <input
                            type="number"
                            id="propertyValue"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#006B6B] focus:border-[#006B6B]"
                            placeholder="ex: 2400000"
                            value={formData.propertyValue}
                            onChange={(e) => handleInputChange('propertyValue', e.target.value)}
                            min="0"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Valeur locative annuelle de vos bureaux, magasins, ateliers, etc.
                          </p>
                        </div>
                        <div>
                          <label htmlFor="numberOfProperties" className="block text-gray-700 mb-2 font-medium">
                            Nombre de propriétés
                          </label>
                          <input
                            type="number"
                            id="numberOfProperties"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#006B6B] focus:border-[#006B6B]"
                            value={formData.numberOfProperties}
                            onChange={(e) => handleInputChange('numberOfProperties', e.target.value)}
                            min="1"
                          />
                        </div>
                        <div>
                          <label htmlFor="sector" className="block text-gray-700 mb-2 font-medium">
                            Secteur d'activité *
                          </label>
                          <select
                            id="sector"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#006B6B] focus:border-[#006B6B]"
                            value={formData.sector}
                            onChange={(e) => handleInputChange('sector', e.target.value)}
                            required
                          >
                            <option value="general">Activité générale</option>
                            <option value="construction">Bâtiment et travaux publics</option>
                            <option value="real-estate">Activité immobilière</option>
                            <option value="gas-station">Station-service</option>
                            <option value="education">Enseignement</option>
                          </select>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex items-center mb-3">
                            <input
                              type="checkbox"
                              id="hasContracts"
                              checked={formData.hasGovernmentContracts}
                              onChange={(e) => handleInputChange('hasGovernmentContracts', e.target.checked)}
                              className="w-4 h-4 text-[#006B6B] border-gray-300 rounded focus:ring-[#006B6B]"
                            />
                            <label htmlFor="hasContracts" className="ml-2 text-gray-700 font-medium">
                              Bénéficiaire de marchés publics
                            </label>
                          </div>
                          {formData.hasGovernmentContracts && (
                            <div>
                              <label htmlFor="contractAmount" className="block text-gray-700 mb-2">
                                Montant des marchés publics (FCFA) *
                              </label>
                              <input
                                type="number"
                                id="contractAmount"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#006B6B] focus:border-[#006B6B]"
                                placeholder="ex: 10000000"
                                value={formData.contractAmount}
                                onChange={(e) => handleInputChange('contractAmount', e.target.value)}
                                required
                                min="0"
                              />
                            </div>
                          )}
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex items-center mb-3">
                            <input
                              type="checkbox"
                              id="isImporter"
                              checked={formData.isImporter}
                              onChange={(e) => handleInputChange('isImporter', e.target.checked)}
                              className="w-4 h-4 text-[#006B6B] border-gray-300 rounded focus:ring-[#006B6B]"
                            />
                            <label htmlFor="isImporter" className="ml-2 text-gray-700 font-medium">
                              Importateur/Exportateur
                            </label>
                          </div>
                          {formData.isImporter && (
                            <div>
                              <label htmlFor="importExportAmount" className="block text-gray-700 mb-2">
                                Montant des importations/exportations (FCFA) *
                              </label>
                              <input
                                type="number"
                                id="importExportAmount"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#006B6B] focus:border-[#006B6B]"
                                placeholder="ex: 100000000"
                                value={formData.importExportAmount}
                                onChange={(e) => handleInputChange('importExportAmount', e.target.value)}
                                required
                                min="0"
                              />
                            </div>
                          )}
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex items-center mb-3">
                            <input
                              type="checkbox"
                              id="hasProperties"
                              checked={formData.hasProperties}
                              onChange={(e) => handleInputChange('hasProperties', e.target.checked)}
                              className="w-4 h-4 text-[#006B6B] border-gray-300 rounded focus:ring-[#006B moldsuch]"
                            />
                            <label htmlFor="hasProperties" className="ml-2">
                              Possède des propriétés immobilières
                            </label>
                          </div>
                          {formData.hasProperties && (
                            <div>
                              {formData.propertyDetails.map((property, index) => (
                                <div key={index} className="mb-4">
                                  <label>Propriété {index + 1}</label>
                                  <select
                                    value={property.location}
                                    onChange={(e) => {
                                      const newDetails = [...formData.propertyDetails];
                                      newDetails[index].location = e.target.value;
                                      handleInputChange('propertyDetails', newDetails);
                                    }}
                                  >
                                    <option value="">Sélectionnez la ville</option>
                                    <option value="cotonou">Cotonou</option>
                                    <option value="porto-novo">Porto-Novo</option>
                                    <option value="ouidah">Ouidah</option>
                                    <option value="abomey">Abomey</option>
                                    <option value="parakou">Parakou</option>
                                    <option value="other-zone1">Autre (Zone 1)</option>
                                    <option value="other-zone2">Autre (Zone 2)</option>
                                  </select>
                                  <input
                                    type="number"
                                    placeholder="Valeur locative (FCFA)"
                                    value={property.value}
                                    onChange={(e) => {
                                      const newDetails = [...formData.propertyDetails];
                                      newDetails[index].value = parseFloat(e.target.value) || 0;
                                      handleInputChange('propertyDetails', newDetails);
                                    }}
                                  />
                                  <input
                                    type="checkbox"
                                    checked={property.isBuilt}
                                    onChange={(e) => {
                                      const newDetails = [...formData.propertyDetails];
                                      newDetails[index].isBuilt = e.target.checked;
                                      handleInputChange('propertyDetails', newDetails);
                                    }}
                                  />
                                  <label>Propriété bâtie</label>
                                </div>
                              ))}
                              <button type="button" onClick={addProperty}>Ajouter une propriété</button>
                            </div>
                          )}
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex items-center mb-3">
                            <input
                              type="checkbox"
                              id="hasVehicles"
                              checked={formData.hasVehicles}
                              onChange={(e) => handleInputChange('hasVehicles', e.target.checked)}
                              className="w-4 h-4 text-[#006B6B] border-gray-300 rounded focus:ring-[#006B6B]"
                            />
                            <label htmlFor="hasVehicles" className="ml-2">
                              Possède des véhicules à moteur
                            </label>
                          </div>
                          {formData.hasVehicles && (
                            <div>
                              {formData.vehicleDetails.map((vehicle, index) => (
                                <div key={index} className="mb-4">
                                  <label>Véhicule {index + 1}</label>
                                  <select
                                    value={vehicle.type}
                                    onChange={(e) => {
                                      const newDetails = [...formData.vehicleDetails];
                                      newDetails[index].type = e.target.value;
                                      handleInputChange('vehicleDetails', newDetails);
                                    }}
                                  >
                                    <option value="person">Personnes</option>
                                    <option value="goods">Marchandises</option>
                                  </select>
                                  <input
                                    type="number"
                                    placeholder="Puissance (chevaux)"
                                    value={vehicle.power}
                                    onChange={(e) => {
                                      const newDetails = [...formData.vehicleDetails];
                                      newDetails[index].power = parseFloat(e.target.value) || 0;
                                      handleInputChange('vehicleDetails', newDetails);
                                    }}
                                  />
                                  <input
                                    type="checkbox"
                                    checked={vehicle.isPublic}
                                    onChange={(e) => {
                                      const newDetails = [...formData.vehicleDetails];
                                      newDetails[index].isPublic = e.target.checked;
                                      handleInputChange('vehicleDetails', newDetails);
                                    }}
                                  />
                                  <label>Transport public</label>
                                  {vehicle.isPublic && (
                                    <input
                                      type="number"
                                      placeholder="Capacité (places/tonnes)"
                                      value={vehicle.capacity}
                                      onChange={(e) => {
                                        const newDetails = [...formData.vehicleDetails];
                                        newDetails[index].capacity = parseFloat(e.target.value) || 0;
                                        handleInputChange('vehicleDetails', newDetails);
                                      }}
                                    />
                                  )}
                                </div>
                              ))}
                              <button type="button" onClick={addVehicle}>Ajouter un véhicule</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="secondary" to="/">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour
                </span>
              </Button>
              <Button type="submit" disabled={!isFormValid()}>
                Calculer mes impôts
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Revenue;