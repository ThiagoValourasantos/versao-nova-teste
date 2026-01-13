
import React, { useState } from 'react';
import { useApp } from '../hooks/useAppStore';
import AuditModal from './AuditModal';
import { FileEditIcon, HistoryIcon } from './Icons';

const Header: React.FC = () => {
  const { state, setCurrentStep } = useApp();
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-blue">Agentic RFP</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FileEditIcon className="w-4 h-4 mr-2" />
              Editar RFP
            </button>
            <button
              onClick={() => setIsAuditOpen(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-purple rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <HistoryIcon className="w-4 h-4 mr-2" />
              Auditoria
              <span className="ml-2 bg-white text-brand-purple text-xs font-bold px-2 py-0.5 rounded-full">
                {state.auditLogs.length}
              </span>
            </button>
          </div>
        </div>
      </header>
      {isAuditOpen && <AuditModal onClose={() => setIsAuditOpen(false)} />}
    </>
  );
};

export default Header;
