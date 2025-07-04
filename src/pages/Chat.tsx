import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import { useTax } from '../context/TaxContext';
import { formatCurrency } from '../utils/taxCalculations';

// Extend the Window interface to include Tawk_API
declare global {
  interface Window {
    Tawk_API?: any;
  }
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { calculationResult, taxpayerData } = useTax();

  // Charger et configurer Tawk.to
  useEffect(() => {
    if (!document.getElementById('tawk-script')) {
      const script = document.createElement('script');
      script.id = 'tawk-script';
      script.async = true;
      script.src = 'https://embed.tawk.to/682762fefe00b3190d753e15/1irctlcv3';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.body.appendChild(script);

      script.onload = () => {
        if (window.Tawk_API) {
          // Masquer le widget flottant (icône pop-up)
          window.Tawk_API.hideWidget();

          // Passer les données fiscales
          window.Tawk_API.visitor = {
            name: 'Utilisateur Simulation Impôts',
            email: '',
            custom: {
              regime: calculationResult?.regime || 'Inconnu',
              totalTax: formatCurrency(calculationResult?.totalTax || 0),
              revenue: formatCurrency(taxpayerData.revenue || 0),
              taxpayerType: taxpayerData.taxpayerType || 'Inconnu',
            },
          };
        }
      };

      // Nettoyage
      return () => {
        if (document.getElementById('tawk-script')) {
          document.body.removeChild(script);
        }
      };
    }
  }, [calculationResult, taxpayerData]);

  // Rediriger si aucun résultat
  if (!calculationResult) {
    navigate('/results');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Discussion avec l'IA
          </h2>
          <p className="text-gray-600 mb-6">
            Posez vos questions sur votre simulation fiscale (Régime {calculationResult.regime}, Impôt total : {formatCurrency(calculationResult.totalTax)}) ou sur vos obligations fiscales.
          </p>

          {/* Résumé des résultats */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Résumé de votre simulation</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Chiffre d'affaires : {formatCurrency(taxpayerData.revenue)}</li>
              <li>Régime fiscal : {calculationResult.regime === 'TPS' ? 'Taxe Professionnelle Synthétique' : 'Régime du Réel'}</li>
              <li>Impôt total : {formatCurrency(calculationResult.totalTax)}</li>
            </ul>
          </div>

          {/* Conteneur pour le chat */}
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[600px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Zone de discussion</h3>
            <p className="text-gray-600 mb-4">
              Utilisez la zone ci-dessous pour discuter avec l'IA. Si la conversation ne s'affiche pas immédiatement, veuillez patienter quelques secondes.
            </p>
            <iframe
              src="https://tawk.to/chat/682762fefe00b3190d753e15/1irctlcv3"
              className="w-full h-[500px] border-none"
              title="Tawk.to Chat"
              allow="microphone; camera"
            ></iframe>
          </div>

          {/* Boutons de navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6">
            <Button variant="secondary" to="/results">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour aux résultats
              </span>
            </Button>
            <Button onClick={() => navigate('/')}>
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

export default Chat;