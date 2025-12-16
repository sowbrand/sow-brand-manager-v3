
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  observations?: string;
  address?: string;
  cnpj?: string;
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
  clientName: string;
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

// --- TIPOS DO ORÇAMENTO ---
export interface BudgetItem {
  id: string;
  type: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface BudgetProposal {
  id: string;
  number: number;
  year: number;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  date: string;
  deliveryDate: string;
  items: BudgetItem[];
  observations: string;
}

// --- TIPOS AVANÇADOS DA FICHA TÉCNICA (5 PÁGINAS) ---

export interface MeasurementRow {
  id: string;
  pointOfMeasure: string; // ex: "Largura do Busto"
  tol: string; // Tolerância (+/- 1cm)
  sizes: { [key: string]: string }; // { P: "50", M: "52" ... }
}

export interface BomItem {
  id: string;
  component: string; // ex: "Tecido Principal", "Linha", "Etiqueta"
  description: string;
  supplier: string;
  consumption: string;
  cost: string;
}

export interface TechPackData {
  // Cabeçalho Geral
  reference: string;
  collection: string;
  product: string;
  season: string;
  sampleSize: string; // Tamanho Piloto
  
  // Página 1: Capa
  frontImage: string;
  backImage: string;
  fabricComposition: string;
  
  // Página 2: Medidas
  sizeRange: string[]; // ["P", "M", "G", "GG"]
  measurements: MeasurementRow[];
  
  // Página 3: Costura
  machinery: string[]; // ["Reta", "Overlock", "Galoneira"]
  stitchingDetails: string;
  constructionComments: string;
  
  // Página 4: Estamparia / DTF
  printTechnique: 'Silk' | 'DTF' | 'Sublimação' | 'Bordado';
  dtfSettings?: {
    temperature: string;
    time: string;
    pressure: string;
    peeling: 'Quente' | 'Frio';
  };
  printColors: string; // Referência Pantone ou Cor
  printPosition: string;
  
  // Página 5: Materiais (BOM)
  bom: BomItem[];
}
