
import React, { useMemo } from 'react';
import { useApp } from '../hooks/useAppStore';
import { Evaluation } from '../types';
import { DownloadIcon, RefreshCwIcon, FileEditIcon, HistoryIcon } from '../components/Icons';

const Step6_ResultadosRanking: React.FC = () => {
    const { state, logEvent, setCurrentStep, setState } = useApp();

    const rankedVendors = useMemo(() => {
        return [...state.evaluations].sort((a, b) => b.scores.final - a.scores.final);
    }, [state.evaluations]);

    const handleGenerateReport = () => {
        alert('Simulação: O relatório em PDF seria gerado aqui.');
        logEvent('Relatório', 'Ação', 'Relatório final gerado');
    };

    const handleNewRound = () => {
        if(window.confirm('Isso irá apagar as avaliações atuais e o levará para a etapa de fornecedores. Deseja continuar?')) {
            setState(prevState => ({...prevState, evaluations: []}));
            logEvent('Avaliação', 'Ação', 'Segunda rodada iniciada');
            setCurrentStep(4);
        }
    };

    const getTrophyColor = (index: number) => {
        if (index === 0) return 'text-yellow-500';
        if (index === 1) return 'text-gray-400';
        if (index === 2) return 'text-yellow-700';
        return 'text-gray-300';
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Resultados e Ranking Final</h2>
            <p className="text-gray-600 mb-8">Esta é a classificação final dos fornecedores com base na análise completa.</p>

            <div className="space-y-4">
                {rankedVendors.map((vendor, index) => (
                    <div 
                        key={vendor.vendorId} 
                        className={`border rounded-lg p-4 flex items-center transition-all duration-300 ${index === 0 ? 'bg-gradient-to-r from-light-purple to-white border-brand-purple shadow-lg scale-105' : 'bg-white'}`}
                    >
                        <div className="flex items-center justify-center w-16 text-3xl font-bold">
                            <span className={getTrophyColor(index)}>#{index + 1}</span>
                        </div>
                        <div className="flex-grow ml-4">
                            <h3 className={`text-xl font-bold ${index === 0 ? 'text-brand-purple' : 'text-gray-800'}`}>{vendor.vendorName}</h3>
                            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1 text-sm text-gray-600">
                                <span><strong>Técnico:</strong> {vendor.scores.technical}</span>
                                <span><strong>Conformidade:</strong> {vendor.scores.compliance}</span>
                                <span><strong>Comercial:</strong> {vendor.scores.commercial}</span>
                            </div>
                        </div>
                        <div className="text-right ml-4">
                            <p className="text-sm text-gray-500">Média Final</p>
                            <p className={`text-4xl font-extrabold ${index === 0 ? 'text-brand-purple' : 'text-gray-800'}`}>{vendor.scores.final}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 pt-6 border-t">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Ações Finais</h3>
                 <div className="flex flex-wrap gap-4">
                     <button onClick={handleGenerateReport} className="flex items-center px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-opacity-90">
                         <DownloadIcon className="w-5 h-5 mr-2" />
                         Gerar Relatório Final (PDF)
                     </button>
                     <button onClick={handleNewRound} className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-opacity-90">
                         <RefreshCwIcon className="w-5 h-5 mr-2" />
                         Iniciar Segunda Rodada
                     </button>
                      <button onClick={() => setCurrentStep(4)} className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                         <HistoryIcon className="w-5 h-5 mr-2" />
                         Editar Fornecedores
                     </button>
                     <button onClick={() => setCurrentStep(2)} className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                         <FileEditIcon className="w-5 h-5 mr-2" />
                         Editar Critérios
                     </button>
                 </div>
            </div>
        </div>
    );
};

export default Step6_ResultadosRanking;
