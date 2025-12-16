
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  observations?: string;
}

export type SupplierCategory = 
  | 'Malha' 
  | 'Modelagem' 
  | 'Corte' 
  | 'Costura' 
  | 'Bordado'
  | 'Estampa Silk' 
  | 'Impressão DTF' 
  | 'Prensa DTF' 
  | 'Acabamento';

export interface Supplier {
  id: string;
  name: string;
  category: SupplierCategory;
  contact: string;
}

export type ProductionStatus = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Atrasado';

export interface ProductionStage {
  supplierId?: string;
  dateIn?: string;
  dateOut?: string;
  status: ProductionStatus;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string; // Denormalized for display
  product: string;
  quantity: number;
  modelingOrigin: 'Sow Brand' | 'Cliente';
  createdAt: string;
  stages: {
    modelagem: ProductionStage;
    corte: ProductionStage;
    costura: ProductionStage;
    bordado: ProductionStage;
    silk: ProductionStage;
    dtfPrint: ProductionStage;
    dtfPress: ProductionStage;
    acabamento: ProductionStage;
  };
}

export interface CompanySettings {
  name: string;
  cnpj: string;
  address: string;
  contact: string;
  logoUrl: string;
  footerText: string;
}