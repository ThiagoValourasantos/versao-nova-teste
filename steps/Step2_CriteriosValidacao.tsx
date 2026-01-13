import React, { useState, useRef, ChangeEvent } from 'react';
import { useApp } from '../hooks/useAppStore';
import { UploadedFile } from '../types';
import { ChevronRightIcon } from '../components/Icons';

const Step2_CriteriosValidacao: React.FC = () => {
  const { state, setState, logEvent, setCurrentStep } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [charCount, setCharCount] = useState(state.manualCriteria.length);
  // FIX: `state.criteriaSource` can be 'sharepoint', which is not a valid type for `selectedMode`.
  // Default to null in this case, as `selectedMode` is not used when `criteriaSource` is 'sharepoint'.
  const [selectedMode, setSelectedMode] = useState<'upload' | 'manual' | null>(
    state.criteriaSource === 'sharepoint' ? null : state.criteriaSource
  );

  const handleManualChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setState(prevState => ({ ...prevState, manualCriteria: e.target.value, criteriaSource: 'manual' }));
    setCharCount(e.target.value.length);
  };
  
  const handleManualBlur = () => {
    logEvent('Critérios', 'Edição', 'Critérios manuais alterados', { length: state.manualCriteria.length });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if(allowedTypes.includes(file.type)) {
        const uploadedFile: UploadedFile = { name: file.name, size: file.size, type: file.type };
        setState(prevState => ({ ...prevState, uploadedCriteriaFile: uploadedFile, criteriaSource: 'upload' }));
        logEvent('Critérios', 'Sucesso', 'Arquivo de critérios carregado', { name: file.name, size: file.size });
        setSelectedMode('upload');
      } else {
        alert('Tipos de arquivo permitidos: PDF, DOC, DOCX.');
      }
    }
  };

  const isNextDisabled = state.rfpSource === 'upload' && (!state.criteriaSource || (state.criteriaSource === 'manual' && state.manualCriteria.trim() === ''));

  if (state.rfpSource === 'sharepoint') {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Definição dos Critérios de Validação</h2>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md text-left max-w-2xl mx-auto">
          <p className="font-bold">Etapa Concluída Automaticamente</p>
          <p>Os critérios de validação foram importados junto com a RFP do SharePoint.</p>
        </div>
        <div className="mt-6 p-4 bg-gray-50 border rounded-md text-left max-w-2xl mx-auto">
            <h4 className="font-semibold mb-2">Critérios importados:</h4>
            <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans">{state.manualCriteria}</pre>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button onClick={() => setCurrentStep(1)} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Voltar</button>
          <button onClick={() => setCurrentStep(3)} className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 flex items-center">
            Continuar <ChevronRightIcon className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-green-800">
      <h2 className="text-2xl font-bold mb-2">Definição dos Critérios de Validação</h2>
      <p className="text-gray-600 mb-8">Faça o upload de um documento com os critérios ou digite-os diretamente.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload */}
        <div className={`p-6 border-2 rounded-lg transition-colors ${selectedMode === 'upload' ? 'border-green-500 bg-light-green' : 'border-gray-300'}`}>
          <h3 className="text-lg font-semibold mb-4">Modo 1: Upload de arquivo</h3>
          <button onClick={handleUploadClick} className="w-full px-4 py-3 bg-white border border-green-500 text-green-700 rounded-lg hover:bg-green-50">
            Selecionar arquivo (PDF, DOC, DOCX)
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
          {state.uploadedCriteriaFile && (
            <div className="mt-4 p-2 bg-green-200 text-sm rounded-md">
              <p><strong>Arquivo:</strong> {state.uploadedCriteriaFile.name}</p>
              <p><strong>Tamanho:</strong> {(state.uploadedCriteriaFile.size / 1024).toFixed(2)} KB</p>
            </div>
          )}
        </div>

        {/* Manual */}
        <div className={`p-6 border-2 rounded-lg transition-colors ${selectedMode === 'manual' ? 'border-green-500 bg-light-green' : 'border-gray-300'}`}>
          <h3 className="text-lg font-semibold mb-4">Modo 2: Digitar critérios</h3>
          <textarea
            value={state.manualCriteria}
            onChange={handleManualChange}
            onBlur={handleManualBlur}
            onFocus={() => setSelectedMode('manual')}
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={`• Requisito técnico obrigatório…\n• Nível mínimo de conformidade…\n• Critérios de exclusão…`}
            style={{minHeight: '200px'}}
          ></textarea>
          <p className="text-right text-xs text-gray-500 mt-1">{charCount} caracteres</p>
        </div>
      </div>
      
      <div className="mt-10 flex justify-between">
        <button onClick={() => setCurrentStep(1)} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Voltar</button>
        <button 
          onClick={() => setCurrentStep(3)} 
          disabled={isNextDisabled}
          className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-opacity-90 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Analisar Critérios <ChevronRightIcon className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Step2_CriteriosValidacao;