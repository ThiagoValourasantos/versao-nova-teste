
import { RFP, AnalysisResult, Evaluation, Vendor } from '../types';

export const mockRFPs: RFP[] = [
  {
    id: 'rfp-001',
    name: 'Implementação de Sistema ERP Cloud',
    code: 'RFP-2024-ERP-01',
    date: '15/05/2024',
    status: 'Aberta',
    criteria: '• Mínimo 5 anos de experiência em ERP para indústria.\n• Conformidade com LGPD.\n• Suporte 24/7.\n• SLA de 99.9% de uptime.',
  },
  {
    id: 'rfp-002',
    name: 'Solução de Cibersegurança Avançada',
    code: 'RFP-2024-SEC-03',
    date: '01/06/2024',
    status: 'Em Análise',
    criteria: '• Detecção e resposta a ameaças em tempo real (EDR).\n• Certificações ISO 27001 e SOC 2.\n• Equipe de resposta a incidentes dedicada.',
  },
  {
    id: 'rfp-003',
    name: 'Desenvolvimento de App Mobile Híbrido',
    code: 'RFP-2024-MOB-05',
    date: '10/06/2024',
    status: 'Aberta',
    criteria: '• Experiência comprovada com React Native ou Flutter.\n• Portfólio com pelo menos 3 apps publicados.\n• Integração com APIs RESTful.',
  },
];

export const mockAnalysisResult: AnalysisResult = {
  technical: [
    'Plataforma baseada em microserviços',
    'Compatibilidade com infraestrutura Kubernetes',
    'API Gateway para gerenciamento de tráfego',
    'Banco de dados PostgreSQL ou compatível',
  ],
  functional: [
    'Módulo de gestão de usuários com perfis de acesso',
    'Dashboard de métricas personalizável',
    'Geração de relatórios em PDF e Excel',
    'Notificações por e-mail e push',
  ],
  commercial: [
    'Modelo de licenciamento por usuário ativo',
    'Contrato mínimo de 24 meses',
    'Plano de suporte premium incluso',
    'Descontos progressivos por volume',
  ],
  criticalPoints: [
    'Necessidade de integração com sistema legado via ETL',
    'Requisito de performance para 10.000 requisições por segundo',
    'Prazo de implementação agressivo (90 dias)',
  ],
};

export const generateMockEvaluations = (vendors: Vendor[]): Evaluation[] => {
    return vendors.map(vendor => {
        const technical = Math.floor(Math.random() * 30) + 70; // 70-100
        const compliance = Math.floor(Math.random() * 25) + 75; // 75-100
        const commercial = Math.floor(Math.random() * 35) + 65; // 65-100
        const final = Math.round((technical * 0.4) + (compliance * 0.3) + (commercial * 0.3));

        return {
            vendorId: vendor.id,
            vendorName: vendor.name,
            scores: {
                technical,
                compliance,
                commercial,
                final,
            },
            qualitative: {
                strengths: ['Plataforma robusta e escalável', 'Excelente suporte técnico', 'Preço competitivo'],
                weaknesses: ['Curva de aprendizado da interface', 'Poucas opções de personalização no plano básico'],
                criticalGaps: ['Não atende ao requisito de performance de 10k req/s', 'Prazo de implementação excede o solicitado em 30 dias'],
            }
        };
    });
};
