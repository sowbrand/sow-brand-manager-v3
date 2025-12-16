export interface CompanySettings {
  id?: number;
  name: string;
  cnpj: string;
  address: string;
  contact: string;
  logoUrl: string;     // Atenção: camelCase para combinar com seu código
  footerText: string;  // Atenção: camelCase para combinar com seu código
}

export interface Client {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  cnpj: string;
  observations: string;
}

export interface Supplier {
  id?: string;
  name: string;
  category: string;
  contact: string;
}

// Interface flexível para os pedidos e etapas
export interface ProductionOrder {
  id?: string;
  orderNumber: string;
  clientName: string;
  product: string;
  quantity: number;
  modelingOrigin: 'Interno' | 'Cliente';
  stages: Record<string, any>; // Permite salvar o JSON do Supabase
}