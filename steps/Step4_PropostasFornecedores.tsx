
import React from 'react';
import { useApp } from '../hooks/useAppStore';
import { Vendor, UploadedFile } from '../types';
import { ChevronRightIcon, ChevronLeftIcon, PlusCircleIcon, UploadCloudIcon, FileIcon, TrashIcon } from '../components/Icons';

const VendorCard: React.FC<{ vendor: Vendor }> = ({ vendor }) => {
    const { updateVendor, removeVendor, logEvent } = useApp();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateVendor({ ...vendor, name: e.target.value });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newProposals: UploadedFile[] = Array.from(files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
            }));
            const updatedVendor = {...vendor, proposals: [...vendor.proposals, ...newProposals]};
            updateVendor(updatedVendor);
            logEvent('Fornecedores', 'Sucesso', 'Proposta(s) carregada(s)', { vendor: vendor.name, files: newProposals.map(f => f.name)});
        }
    };
    
    const removeFile = (fileName: string) => {
        const updatedVendor = {...vendor, proposals: vendor.proposals.filter(f => f.name !== fileName)};
        updateVendor(updatedVendor);
        logEvent('Fornecedores', 'Edição', 'Proposta removida', { vendor: vendor.name, file: fileName});
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <input 
                    type="text" 
                    value={vendor.name} 
                    onChange={handleNameChange}
                    className="text-lg font-semibold bg-transparent border-b-2 border-transparent focus:border-brand-blue outline-none w-full"
                />
                <button onClick={() => removeVendor(vendor.id)} className="p-1 text-gray-400 hover:text-red-600 rounded-full">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
            
            <label className="cursor-pointer flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <UploadCloudIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Arraste ou clique para adicionar propostas</span>
                <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>
            
            {vendor.proposals.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">Arquivos enviados:</h4>
                    {vendor.proposals.map(file => (
                        <div key={file.name} className="flex items-center justify-between bg-white p-2 rounded-md border">
                            <div className="flex items-center text-sm">
                                <FileIcon className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="font-medium">{file.name}</span>
                                <span className="text-gray-500 ml-2">- {(file.size / 1024).toFixed(1)} KB</span>
                            </div>
                            <button onClick={() => removeFile(file.name)} className="text-gray-400 hover:text-red-600">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Step4_PropostasFornecedores: React.FC = () => {
    const { state, setCurrentStep, addVendor } = useApp();
    const isNextDisabled = state.vendors.length === 0 || state.vendors.some(v => v.proposals.length === 0);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Propostas dos Fornecedores</h2>
            <p className="text-gray-600 mb-8">Adicione os fornecedores participantes e faça o upload de suas propostas.</p>
            
            <div className="space-y-6">
                {state.vendors.map(vendor => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                ))}
            </div>
            
            <button onClick={addVendor} className="mt-8 flex items-center px-4 py-2 text-brand-blue border-2 border-dashed border-brand-blue rounded-lg hover:bg-light-blue transition-colors">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Adicionar Fornecedor
            </button>

            <div className="mt-10 flex justify-between">
                <button onClick={() => setCurrentStep(3)} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Voltar
                </button>
                <button
                    onClick={() => setCurrentStep(5)}
                    disabled={isNextDisabled}
                    className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Iniciar Avaliação <ChevronRightIcon className="w-5 h-5 ml-1" />
                </button>
            </div>
        </div>
    );
};

export default Step4_PropostasFornecedores;
