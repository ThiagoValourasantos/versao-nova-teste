
export interface RFP {
  id: string;
  name: string;
  code: string;
  date: string;
  status: 'Aberta' | 'Em Análise' | 'Fechada';
  criteria: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export interface Vendor {
  id:string;
  name: string;
  proposals: UploadedFile[];
}

export interface AnalysisResult {
  technical: string[];
  functional: string[];
  commercial: string[];
  criticalPoints: string[];
}

export interface Evaluation {
  vendorId: string;
  vendorName: string;
  scores: {
    technical: number;
    compliance: number;
    commercial: number;
    final: number;
  };
  qualitative: {
    strengths: string[];
    weaknesses: string[];
    criticalGaps: string[];
  };
}

export type AuditCategory = 'Navegação' | 'Seleção' | 'Critérios' | 'Análise' | 'Fornecedores' | 'Avaliação' | 'Sistema' | 'Relatório';
export type AuditType = 'Info' | 'Ação' | 'Edição' | 'Sucesso' | 'Erro';

export interface AuditLog {
  id: string;
  timestamp: string;
  category: AuditCategory;
  type: AuditType;
  message: string;
  data?: any;
}

export interface AppState {
  currentStep: number;
  selectedRfp: RFP | null;
  rfpSource: 'sharepoint' | 'upload' | null;
  uploadedRfpFile: UploadedFile | null;
  criteriaSource: 'upload' | 'manual' | 'sharepoint' | null;
  uploadedCriteriaFile: UploadedFile | null;
  manualCriteria: string;
  analysisResult: AnalysisResult | null;
  vendors: Vendor[];
  evaluations: Evaluation[];
  auditLogs: AuditLog[];
}
