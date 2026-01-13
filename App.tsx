
import React from 'react';
import { AppProvider, useApp } from './hooks/useAppStore';
import Header from './components/Header';
import Wizard from './components/Wizard';
import Footer from './components/Footer';

import Step1_SelecaoRFP from './steps/Step1_SelecaoRFP';
import Step2_CriteriosValidacao from './steps/Step2_CriteriosValidacao';
import Step3_AnaliseIA from './steps/Step3_AnaliseIA';
import Step4_PropostasFornecedores from './steps/Step4_PropostasFornecedores';
import Step5_AvaliacaoInteligente from './steps/Step5_AvaliacaoInteligente';
import Step6_ResultadosRanking from './steps/Step6_ResultadosRanking';

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

const MainContent: React.FC = () => {
  const { state } = useApp();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1_SelecaoRFP />;
      case 2:
        return <Step2_CriteriosValidacao />;
      case 3:
        return <Step3_AnaliseIA />;
      case 4:
        return <Step4_PropostasFornecedores />;
      case 5:
        return <Step5_AvaliacaoInteligente />;
      case 6:
        return <Step6_ResultadosRanking />;
      default:
        return <Step1_SelecaoRFP />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Wizard />
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg min-h-[500px]">
          {renderStep()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
