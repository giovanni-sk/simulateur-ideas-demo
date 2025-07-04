// Results.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import ExpandableSection from '../components/ExpandableSection';
import { useTax } from '../context/TaxContext';
import { formatCurrency } from '../utils/taxCalculations';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { calculationResult, taxpayerData, resetData } = useTax();

  if (!calculationResult) {
    navigate('/');
    return null;
  }

  const handleNewCalculation = () => {
    resetData();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Résultat de la simulation</h2>
          <p className="text-gray-600 mb-8">
            Calcul basé sur le régime  {calculationResult.regime} - Chiffre d’affaires: {formatCurrency(taxpayerData.revenue)}
          </p>
          <div className="bg-gradient-to-r from-[#FFF2B8] to-[#FFE082] rounded-lg p-8 mb-8 text-center shadow-lg">
            <h3 className="text-xl text-gray-800 mb-4">Le montant prévisionnel de vos impôts est:</h3>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {formatCurrency(calculationResult.totalTax)}
              <span className="text-xl align-top"> *</span>
            </div>
            <p className="text-sm text-gray-600 italic max-w-2xl mx-auto">
              *Attention : Ce montant est une simulation basée sur les informations fournies. Faites vos déclarations auprès de l’administration fiscale pour un résultat fiable.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <ExpandableSection title="Détails du calcul" defaultOpen={true}>
              <div className="px-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-[#006B6B]">
                    Régime fiscal : {calculationResult.regime === 'TPS' ? 'Taxe Professionnelle Synthétique' : 'Régime du Réel'}
                  </h4>
                  {calculationResult.details.map((detail, index) => (
                    <p key={index} className="mb-2 text-gray-700">{detail}</p>
                  ))}
                </div>
                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-800">Décomposition des impôts :</h5>
                  {calculationResult.breakdown.map((item, index) => (
                    <div key={index} className="border-l-4 border-[#006B6B] pl-4 py-2 bg-gray-50 rounded-r">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h6 className="font-medium text-gray-800">{item.name}</h6>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          {item.rate && (
                            <span className="inline-block bg-[#006B6B] text-white text-xs px-2 py-1 rounded mt-2">
                              Taux: {item.rate}
                            </span>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <span className="font-bold text-lg text-[#006B6B]">
                            {item.amount > 0 ? formatCurrency(item.amount) : 'Information'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ExpandableSection>
            <ExpandableSection title="Obligations fiscales et échéances">
              <div className="px-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Échéances de paiement :</h5>
                    <ul className="space-y-2 text-sm">
                      {calculationResult.regime === 'TPS' ? (
                        <>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-[#006B6B] rounded-full mr-2"></span>
                            <strong>10 février :</strong> Premier acompte (50% de l’impôt précédent)
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-[#006B6B] rounded-full mr-2"></span>
                            <strong>10 juin :</strong> Deuxième acompte (50% de l’impôt précédent)
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-[#006B6B] rounded-full mr-2"></span>
                            <strong>30 avril :</strong> Déclaration annuelle et solde
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-[#006B6B] rounded-full mr-2"></span>
                            <strong>10 de chaque mois :</strong> Déclarations mensuelles (TVA, AIB, etc.)
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-[#006B6B] rounded-full mr-2"></span>
                            <strong>10 mars, juin, septembre, décembre :</strong> Acomptes trimestriels
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-[#006B6B] rounded-full mr-2"></span>
                            <strong>30 avril :</strong> Déclaration annuelle et solde
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Obligations principales :</h5>
                    <ul className="space-y-2 text-sm">
                      {calculationResult.additionalInfo.slice(0, 4).map((info, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          {info}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ExpandableSection>
            <ExpandableSection title="Informations complémentaires">
              <div className="px-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Centre d’impôts compétent :</h5>
                    <p className="text-blue-700 text-sm">
                      {calculationResult.regime === 'TPS'
                        ? 'Centre des Impôts des Petites Entreprises (CIPE) de votre commune'
                        : taxpayerData.revenue > 1000000000
                          ? 'Direction des Grandes Entreprises (DGE)'
                          : 'Centre des Impôts des Moyennes Entreprises (CIME)'}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">Contact et assistance :</h5>
                    <p className="text-green-700 text-sm">
                      Pour toute information complémentaire, contactez la Cellule du Service au Contribuables sur le  <strong>133</strong>
                    </p>
                  </div>
                  {calculationResult.additionalInfo.length > 4 && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Autres obligations :</h5>
                      <ul className="space-y-2">
                        {calculationResult.additionalInfo.slice(4).map((info, index) => (
                          <li key={index} className="text-sm text-gray-600 flex-items-start">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                            {info}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </ExpandableSection>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button variant="secondary" to="/">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Modifier les données
              </span>
            </Button>
            <Button to="/chat">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8" />
                </svg>
                Discuter avec l'IA
              </span>
            </Button>
            <Button onClick={handleNewCalculation}>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Nouvelle simulation
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;