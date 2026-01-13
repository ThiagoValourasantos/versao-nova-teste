
import React from 'react';
import { useApp } from '../hooks/useAppStore';
import { CheckIcon } from './Icons';

const Wizard: React.FC = () => {
  const { state } = useApp();
  const { currentStep } = state;

  const steps = [
    'Seleção da RFP',
    'Critérios de Validação',
    'Análise IA',
    'Propostas (Fornecedores)',
    'Avaliação Inteligente',
    'Resultados e Ranking Final',
  ];
  
  const isStepCompleted = (stepIndex: number) => {
    // Special case for step 2 when skipped
    if (stepIndex === 1 && state.rfpSource === 'sharepoint' && currentStep > 2) {
      return true;
    }
    return stepIndex < currentStep - 1;
  }

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((stepName, stepIdx) => {
          const stepNumber = stepIdx + 1;
          const isCurrent = stepNumber === currentStep;
          const isCompleted = isStepCompleted(stepIdx);
          
          let statusText = '';
          if (stepNumber === 2 && state.rfpSource === 'sharepoint' && currentStep > 2) {
            statusText = ' (Concluída automaticamente)';
          }

          return (
            <li key={stepName} className="md:flex-1">
              {isCompleted || (stepNumber === 2 && statusText) ? (
                <div className="group flex flex-col border-l-4 border-brand-blue py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-brand-blue">{`Etapa ${stepNumber}`}</span>
                  <span className="text-sm font-medium text-gray-700 flex items-center">{stepName} {statusText} <CheckIcon className="w-5 h-5 ml-2 text-brand-blue" /></span>
                </div>
              ) : isCurrent ? (
                <div className="flex flex-col border-l-4 border-brand-blue py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
                  <span className="text-sm font-medium text-brand-blue">{`Etapa ${stepNumber}`}</span>
                  <span className="text-sm font-medium text-gray-900">{stepName}</span>
                </div>
              ) : (
                <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500">{`Etapa ${stepNumber}`}</span>
                  <span className="text-sm font-medium text-gray-600">{stepName}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Wizard;
