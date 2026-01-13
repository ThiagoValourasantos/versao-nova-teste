
import React, { useState, useRef } from 'react';
import { useApp } from '../hooks/useAppStore';
import { mockRFPs } from '../data/mockData';
import { RFP, UploadedFile } from '../types';
import { FileTextIcon, UploadCloudIcon, CheckIcon } from '../components/Icons';

const Step1_SelecaoRFP: React.FC = () => {
  const { state, setState, logEvent, setCurrentStep } = useApp();
  const [selectedSource, setSelectedSource] = useState<'sharepoint' | 'upload' | null>(state.rfpSource);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSharePointSelect = (rfp: RFP) => {
    setState(prevState => ({
      ...prevState,
      selectedRfp: rfp,
      rfpSource: 'sharepoint',
      manualCriteria: rfp.criteria,
      criteriaSource: 'sharepoint',
      uploadedRfpFile: null,
    }));
    logEvent('Seleção', 'Sucesso', 'RFP selecionada do SharePoint', { name: rfp.name, code: rfp.code });
    setCurrentStep(3);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
      };
      setState(prevState => ({
        ...prevState,
        uploadedRfpFile: uploadedFile,
        rfpSource: 'upload',
        selectedRfp: null,
        manualCriteria: '',
        criteriaSource: null,
      }));
      logEvent('Seleção', 'Sucesso', 'RFP carregada via upload', { name: file.name, size: file.size });
      setSelectedSource('upload');
      setCurrentStep(2);
    } else {
      alert('Por favor, selecione um arquivo PDF.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Seleção da RFP</h2>
      <p className="text-gray-600 mb-8">Escolha uma RFP existente no SharePoint ou faça o upload de um novo documento.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* SharePoint Card */}
        <div
          className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${selectedSource === 'sharepoint' ? 'border-brand-blue bg-light-blue shadow-lg' : 'border-gray-300 hover:border-brand-blue hover:shadow-md'}`}
          onClick={() => setSelectedSource('sharepoint')}
        >
          {state.rfpSource === 'sharepoint' && state.selectedRfp && (
            <div className="absolute top-3 right-3 bg-brand-blue text-white rounded-full p-1">
              <CheckIcon className="w-4 h-4" />
            </div>
          )}
          <div className="flex items-center mb-4">
            <FileTextIcon className="w-10 h-10 text-brand-blue mr-4" />
            <div>
              <h3 className="text-xl font-semibold">Selecionar do SharePoint</h3>
              <p className="text-gray-500">Use uma RFP já existente.</p>
            </div>
          </div>
          {selectedSource === 'sharepoint' && (
            <div className="mt-6 space-y-3 animate-fade-in">
              <h4 className="font-semibold text-gray-700">RFPs disponíveis:</h4>
              {mockRFPs.map(rfp => (
                <button
                  key={rfp.id}
                  onClick={() => handleSharePointSelect(rfp)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${state.selectedRfp?.id === rfp.id ? 'bg-brand-blue text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <p className="font-bold">{rfp.name}</p>
                  <p className="text-sm">{rfp.code} - {rfp.date}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Upload Card */}
        <div
          className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${selectedSource === 'upload' ? 'border-brand-blue bg-light-blue shadow-lg' : 'border-gray-300 hover:border-brand-blue hover:shadow-md'}`}
          onClick={handleUploadClick}
        >
          {state.rfpSource === 'upload' && state.uploadedRfpFile && (
            <div className="absolute top-3 right-3 bg-brand-blue text-white rounded-full p-1">
              <CheckIcon className="w-4 h-4" />
            </div>
          )}
          <div className="flex items-center mb-4">
            <UploadCloudIcon className="w-10 h-10 text-brand-blue mr-4" />
            <div>
              <h3 className="text-xl font-semibold">Fazer Upload de Nova RFP</h3>
              <p className="text-gray-500">Apenas arquivos .PDF são permitidos.</p>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
          {state.rfpSource === 'upload' && state.uploadedRfpFile && (
             <div className="mt-6 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm">
                <p className="font-bold">Arquivo carregado com sucesso:</p>
                <p>{state.uploadedRfpFile.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1_SelecaoRFP;
