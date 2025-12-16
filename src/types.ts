export interface CompanySettings {
  id?: number;
  name: string;
  cnpj: string;
  address: string;
  contact: string;
  // Aceita os dois formatos para não travar o deploy
  logoUrl?: string;    
  logo_url?: string;   
  footerText?: string; 
  footer_text?: string;
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

export interface ProductionOrder {
  id?: string;
  orderNumber: string;
  clientName: string;
  product: string;
  quantity: number;
  modelingOrigin: 'Interno' | 'Cliente';
  stages: any; 
}