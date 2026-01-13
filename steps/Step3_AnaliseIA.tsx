
import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useAppStore';
import { mockAnalysisResult } from '../data/mockData';
import { ChevronRightIcon, ChevronLeftIcon } from '../components/Icons';

const analysisMessages = [
  'Iniciando conexão com Copilot Studio...',
  'Lendo documento da RFP...',
  'Analisando critérios de validação...',
  'Identificando requisitos técnicos...',
  'Extraindo requisitos funcionais e comerciais...',
  'Cruzando dados e identificando pontos críticos...',
  'Gerando sumário executivo...',
  'Análise concluída com sucesso!',
];

const Step3_AnaliseIA: React.FC = () => {
  const { state, setState, logEvent, setCurrentStep } = useApp();
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(!!state.analysisResult);

  useEffect(() => {
    if (state.analysisResult) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + 10;
        if (nextProgress >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setState(prevState => ({ ...prevState, analysisResult: mockAnalysisResult }));
          logEvent('Análise', 'Sucesso', 'Análise de IA concluída');
          return 100;
        }
        return nextProgress;
      });
      setMessageIndex(prev => (prev < analysisMessages.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AnalysisItem: React.FC<{title: string; items: string[]}> = ({ title, items }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Análise com Inteligência Artificial</h2>
      <p className="text-gray-600 mb-8">Simulação de análise da RFP e critérios utilizando o Copilot Studio.</p>

      {!isComplete ? (
        <div className="text-center p-10">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
            <div 
              className="bg-brand-purple h-4 rounded-full transition-all duration-500 ease-linear" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-lg font-medium text-brand-purple animate-pulse">{analysisMessages[messageIndex]}</p>
        </div>
      ) : (
        <div className="space-y-6">
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-md">
                <p className="font-bold">Análise concluída.</p>
                <p>Abaixo estão os principais pontos identificados pela IA.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <AnalysisItem title="Requisitos Técnicos" items={state.analysisResult?.technical || []} />
                <AnalysisItem title="Requisitos Funcionais" items={state.analysisResult?.functional || []} />
                <AnalysisItem title="Requisitos Comerciais" items={state.analysisResult?.commercial || []} />
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Pontos Críticos</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                        {state.analysisResult?.criticalPoints.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            </div>
        </div>
      )}

      <div className="mt-10 flex justify-between">
        <button onClick={() => setCurrentStep(state.rfpSource === 'sharepoint' ? 1 : 2)} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center">
          <ChevronLeftIcon className="w-5 h-5 mr-1"/> Voltar
        </button>
        <button 
          onClick={() => setCurrentStep(4)} 
          disabled={!isComplete}
          className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continuar <ChevronRightIcon className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Step3_AnaliseIA;
