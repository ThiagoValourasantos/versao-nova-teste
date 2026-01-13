
import React, { useState, useMemo } from 'react';
import { useApp } from '../hooks/useAppStore';
import { AuditLog, AuditCategory } from '../types';
import { CloseIcon, FilterIcon, DownloadIcon, InfoIcon, EditIcon, CheckCircleIcon, AlertTriangleIcon, PlayIcon } from './Icons';

const categoryColors: { [key in AuditCategory]: string } = {
  Sistema: 'bg-gray-100 text-gray-800',
  Navegação: 'bg-blue-100 text-blue-800',
  Seleção: 'bg-indigo-100 text-indigo-800',
  Critérios: 'bg-green-100 text-green-800',
  Análise: 'bg-purple-100 text-purple-800',
  Fornecedores: 'bg-yellow-100 text-yellow-800',
  Avaliação: 'bg-pink-100 text-pink-800',
  Relatório: 'bg-teal-100 text-teal-800'
};

const typeIcons: { [key: string]: React.FC<{className: string}> } = {
    Info: InfoIcon,
    Ação: PlayIcon,
    Edição: EditIcon,
    Sucesso: CheckCircleIcon,
    Erro: AlertTriangleIcon
};

const AuditModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state } = useApp();
  const [filter, setFilter] = useState<AuditCategory | 'Todos'>('Todos');

  const filteredLogs = useMemo(() => {
    if (filter === 'Todos') return state.auditLogs;
    return state.auditLogs.filter(log => log.category === filter);
  }, [state.auditLogs, filter]);

  const exportLogs = () => {
    const content = filteredLogs.map(log => 
      `[${log.timestamp}] [${log.category}/${log.type}] ${log.message}${log.data ? `\nData: ${JSON.stringify(log.data, null, 2)}` : ''}`
    ).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs_agentic_rfp.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const categories: AuditCategory[] = ['Navegação', 'Seleção', 'Critérios', 'Análise', 'Fornecedores', 'Avaliação', 'Relatório', 'Sistema'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Registros de Auditoria</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <CloseIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b">
            <div className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-gray-500" />
                <select 
                    value={filter} 
                    onChange={e => setFilter(e.target.value as AuditCategory | 'Todos')}
                    className="border rounded-md p-2"
                >
                    <option value="Todos">Todas as Categorias</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <span className="text-sm text-gray-600 ml-4">{filteredLogs.length} registro(s)</span>
            </div>
            <button onClick={exportLogs} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-lg hover:bg-opacity-90 transition-colors">
                <DownloadIcon className="w-4 h-4" />
                Exportar para TXT
            </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {filteredLogs.map(log => {
             const Icon = typeIcons[log.type];
             return (
                <div key={log.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {Icon && <Icon className="w-5 h-5 text-gray-500"/>}
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${categoryColors[log.category]}`}>{log.category}</span>
                            <p className="font-medium text-gray-800">{log.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{log.timestamp}</span>
                    </div>
                    {log.data && (
                        <pre className="mt-2 p-2 bg-gray-100 text-xs text-gray-600 rounded-md overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                        </pre>
                    )}
                </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default AuditModal;
