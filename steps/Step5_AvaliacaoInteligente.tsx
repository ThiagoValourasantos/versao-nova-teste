
import React, { useEffect, useState } from 'react';
import { useApp } from '../hooks/useAppStore';
import { generateMockEvaluations } from '../data/mockData';
import { ChevronRightIcon, ChevronLeftIcon } from '../components/Icons';

const Step5_AvaliacaoInteligente: React.FC = () => {
  const { state, setState, logEvent, setCurrentStep } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state.evaluations.length === 0 && state.vendors.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const newEvaluations = generateMockEvaluations(state.vendors);
        setState(prevState => ({ ...prevState, evaluations: newEvaluations }));
        logEvent('Avaliação', 'Sucesso', 'Avaliação inteligente finalizada', { vendorsCount: state.vendors.length });
        setIsLoading(false);
      }, 2500); // Simulate API call
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.vendors]);
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-purple"></div>
            <p className="mt-4 text-lg font-medium text-brand-purple">Avaliando propostas...</p>
        </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Avaliação Inteligente</h2>
      <p className="text-gray-600 mb-8">A IA analisou cada proposta contra os critérios definidos. Veja os resultados preliminares.</p>

      <div className="space-y-6">
        {state.evaluations.map(evaluation => (
          <div key={evaluation.vendorId} className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-bold text-brand-purple mb-4">{evaluation.vendorName}</h3>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Técnico</p>
                    <p className={`text-3xl font-bold ${getScoreColor(evaluation.scores.technical)}`}>{evaluation.scores.technical}</p>
                </div>
                 <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Conformidade</p>
                    <p className={`text-3xl font-bold ${getScoreColor(evaluation.scores.compliance)}`}>{evaluation.scores.compliance}</p>
                </div>
                 <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Comercial</p>
                    <p className={`text-3xl font-bold ${getScoreColor(evaluation.scores.commercial)}`}>{evaluation.scores.commercial}</p>
                </div>
                 <div className="p-4 bg-brand-purple text-white rounded-lg">
                    <p className="text-sm opacity-80">Média Final</p>
                    <p className="text-3xl font-bold">{evaluation.scores.final}</p>
                </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-green-50 p-3 rounded-md">
                    <h4 className="font-semibold text-green-800 mb-1">Pontos Fortes</h4>
                    <ul className="list-disc list-inside text-green-700">
                        {evaluation.qualitative.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                 <div className="bg-yellow-50 p-3 rounded-md">
                    <h4 className="font-semibold text-yellow-800 mb-1">Pontos Fracos</h4>
                    <ul className="list-disc list-inside text-yellow-700">
                         {evaluation.qualitative.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>
                 <div className="bg-red-50 p-3 rounded-md">
                    <h4 className="font-semibold text-red-800 mb-1">Gaps Críticos</h4>
                    <ul className="list-disc list-inside text-red-700">
                        {evaluation.qualitative.criticalGaps.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                </div>
            </div>

          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between">
        <button onClick={() => setCurrentStep(4)} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center">
            <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
        </button>
        <button onClick={() => setCurrentStep(6)} className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 flex items-center">
            Ver Ranking Final <ChevronRightIcon className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Step5_AvaliacaoInteligente;
