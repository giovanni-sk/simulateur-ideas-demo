import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InfoNotice from '../components/InfoNotice';
import RadioOption from '../components/RadioOption';
import Button from '../components/Button';
import { useTax } from '../context/TaxContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { taxpayerData, updateTaxpayerData } = useTax();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taxpayerData.taxpayerType) {
      navigate('/revenue');
    }
  };

  const handleTaxpayerTypeChange = (value: string) => {
    updateTaxpayerData({ 
      taxpayerType: value as 'entrepreneur-individual' | 'entrepreneur-company' | 'individual' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Données du contribuable</h2>
          <p className="text-gray-600 mb-8">Choisissez l'option qui correspond à votre situation</p>
          
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-[#006B6B] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
                Type de contribuable
              </h3>
              
              <div className="mb-6">
                <h4 className="text-[#006B6B] font-medium text-lg mb-2">Entreprise</h4>
                
                <InfoNotice title="Détail">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Vous possédez une entreprise individuelle ou vous êtes une personne physique quel que soit votre chiffre d'affaires ;</li>
                    <li>Personne morale : Vous possédez une entreprise morale (SA, SARL, SAS, etc.) quel que soit votre chiffre d'affaires.</li>
                  </ul>
                </InfoNotice>
                
                <div className="ml-4 mt-4">
                  <RadioOption
                    id="entrepreneur-individual"
                    name="taxpayerType"
                    value="entrepreneur-individual"
                    checked={taxpayerData.taxpayerType === 'entrepreneur-individual'}
                    onChange={() => handleTaxpayerTypeChange('entrepreneur-individual')}
                    label="Personne physique"
                  />
                  
                  <RadioOption
                    id="entrepreneur-company"
                    name="taxpayerType"
                    value="entrepreneur-company"
                    checked={taxpayerData.taxpayerType === 'entrepreneur-company'}
                    onChange={() => handleTaxpayerTypeChange('entrepreneur-company')}
                    label="Personne morale"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-[#006B6B] font-medium text-lg mb-2">Particuliers</h4>
                
                <InfoNotice title="Détail">
                  <p>
                    Cette catégorie s'adresse aux individus souhaitant estimer leurs impôts personnels,
                    quels que soient leur statut professionnel (salarié, entrepreneur, chômeur, etc.). Le
                    calcul prend en compte vos revenus, votre situation familiale et votre patrimoine.
                  </p>
                </InfoNotice>
                
                <div className="ml-4 mt-4">
                  <RadioOption
                    id="individual"
                    name="taxpayerType"
                    value="individual"
                    checked={taxpayerData.taxpayerType === 'individual'}
                    onChange={() => handleTaxpayerTypeChange('individual')}
                    label="Personne physique"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => window.history.back()}>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour
                </span>
              </Button>
              
              <Button type="submit" disabled={!taxpayerData.taxpayerType}>
                Valider
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;