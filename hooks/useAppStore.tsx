
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppState, AuditLog, AuditCategory, AuditType, Vendor } from '../types';

const initialState: AppState = {
  currentStep: 1,
  selectedRfp: null,
  rfpSource: null,
  uploadedRfpFile: null,
  criteriaSource: null,
  uploadedCriteriaFile: null,
  manualCriteria: '',
  analysisResult: null,
  vendors: [],
  evaluations: [],
  auditLogs: [],
};

const AppContext = createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  logEvent: (category: AuditCategory, type: AuditType, message: string, data?: any) => void;
  setCurrentStep: (step: number) => void;
  addVendor: () => void;
  updateVendor: (vendor: Vendor) => void;
  removeVendor: (vendorId: string) => void;
  resetState: () => void;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const storedState = window.localStorage.getItem('agenticRfpState');
      if (storedState) {
        return JSON.parse(storedState);
      }
    } catch (error) {
      console.error("Failed to parse state from localStorage", error);
    }
    return initialState;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('agenticRfpState', JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [state]);

  const logEvent = useCallback((category: AuditCategory, type: AuditType, message: string, data?: any) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      category,
      type,
      message,
      data,
    };
    setState(prevState => ({ ...prevState, auditLogs: [newLog, ...prevState.auditLogs] }));
  }, []);
  
  useEffect(() => {
    if (state.auditLogs.length === 0) {
        logEvent('Sistema', 'Info', 'Aplicação iniciada');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    logEvent('Navegação', 'Info', `Navegou para a etapa ${step}`);
    setState(prevState => ({...prevState, currentStep: step}));
  }, [logEvent]);

  const addVendor = useCallback(() => {
    const newVendor: Vendor = {
        id: `vendor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: `Fornecedor ${state.vendors.length + 1}`,
        proposals: []
    };
    logEvent('Fornecedores', 'Ação', `Novo fornecedor adicionado: ${newVendor.name}`);
    setState(prevState => ({...prevState, vendors: [...prevState.vendors, newVendor]}));
  }, [logEvent, state.vendors.length]);

  const updateVendor = useCallback((updatedVendor: Vendor) => {
    logEvent('Fornecedores', 'Edição', `Dados do fornecedor atualizados: ${updatedVendor.name}`);
    setState(prevState => ({...prevState, vendors: prevState.vendors.map(v => v.id === updatedVendor.id ? updatedVendor : v)}));
  }, [logEvent]);

  const removeVendor = useCallback((vendorId: string) => {
    const vendorName = state.vendors.find(v => v.id === vendorId)?.name || 'desconhecido';
    logEvent('Fornecedores', 'Ação', `Fornecedor removido: ${vendorName}`);
    setState(prevState => ({...prevState, vendors: prevState.vendors.filter(v => v.id !== vendorId)}));
  }, [logEvent, state.vendors]);
  
  const resetState = () => setState(initialState);

  return (
    <AppContext.Provider value={{ state, setState, logEvent, setCurrentStep, addVendor, updateVendor, removeVendor, resetState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
