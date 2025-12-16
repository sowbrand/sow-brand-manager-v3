
import { Client, ProductionOrder, Supplier, CompanySettings } from "./types";

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'Sow Brand',
  cnpj: '00.000.000/0001-00',
  address: 'Rua da Produção, 123 - Polo Têxtil',
  contact: '(11) 99999-9999',
  logoUrl: '', 
  footerText: 'Copyright © Sow Brand – Todos os direitos reservados.',
};

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Marca Urban Style', phone: '(11) 99999-0000', email: 'contato@urban.com', observations: 'Prioridade em entregas' },
  { id: '2', name: 'Boutique Chic', phone: '(21) 98888-1111', email: 'compras@chic.com' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: '101', name: 'Malhas Têxtil SA', category: 'Malha', contact: 'João' },
  { id: '102', name: 'Corte Rápido Ltda', category: 'Corte', contact: 'Maria' },
  { id: '103', name: 'Costura Fina', category: 'Costura', contact: 'Ana' },
  { id: '107', name: 'Bordados Express', category: 'Bordado', contact: 'Dona Vilma' },
  { id: '104', name: 'Silk Master', category: 'Estampa Silk', contact: 'Pedro' },
  { id: '105', name: 'DTF Tech', category: 'Impressão DTF', contact: 'Carlos' },
  { id: '106', name: 'Acabamentos Premium', category: 'Acabamento', contact: 'Lúcia' },
];

export const MOCK_ORDERS: ProductionOrder[] = [
  {
    id: '501',
    orderNumber: 'PED-2023-001',
    clientId: '1',
    clientName: 'Marca Urban Style',
    product: 'Camiseta Oversized',
    quantity: 150,
    modelingOrigin: 'Sow Brand',
    createdAt: '2023-10-01',
    stages: {
      modelagem: { status: 'Concluído', dateIn: '2023-10-02', dateOut: '2023-10-04', supplierId: 'Sow Interno' },
      corte: { status: 'Concluído', dateIn: '2023-10-05', dateOut: '2023-10-07', supplierId: '102' },
      costura: { status: 'Em Andamento', dateIn: '2023-10-08', supplierId: '103' },
      bordado: { status: 'Pendente' },
      silk: { status: 'Pendente' },
      dtfPrint: { status: 'Pendente' },
      dtfPress: { status: 'Pendente' },
      acabamento: { status: 'Pendente' },
    }
  }
];

export const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
