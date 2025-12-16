
import React, { useState } from 'react';
import { ArrowLeft, Printer, Upload, Plus, Trash2, Scissors, Palette, Ruler, Layers, FileText } from 'lucide-react';
import { TechPackData, MeasurementRow, BomItem } from '../types';

const TechPack: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  // Estado Inicial Robusto
  const [data, setData] = useState<TechPackData>({
    reference: 'REF-2025-001',
    collection: 'Verão 2025',
    product: 'T-Shirt Basic Heavy',
    season: 'Alto Verão',
    sampleSize: 'M',
    frontImage: '',
    backImage: '',
    fabricComposition: '100% Algodão 260g/m²',
    sizeRange: ['P', 'M', 'G', 'GG'],
    measurements: [
      { id: '1', pointOfMeasure: 'Largura do Torax', tol: '1', sizes: { P: '50', M: '52', G: '54', GG: '56' } },
      { id: '2', pointOfMeasure: 'Comprimento Total', tol: '1', sizes: { P: '70', M: '72', G: '74', GG: '76' } },
    ],
    machinery: ['Reta', 'Overlock'],
    stitchingDetails: 'Bainha de 2cm na barra e mangas. Reforço de ombro a ombro.',
    constructionComments: 'Utilizar agulha fina para não furar a malha.',
    printTechnique: 'DTF',
    dtfSettings: { temperature: '160ºC', time: '15s', pressure: 'Média/Alta', peeling: 'Frio' },
    printColors: 'CMYK',
    printPosition: 'Centro Frente - 10cm da gola',
    bom: [
      { id: '1', component: 'Tecido Principal', description: 'Malha Menegotti', supplier: 'Menegotti', consumption: '0.45 kg', cost: 'R$ 25,00' },
      { id: '2', component: 'Etiqueta Nuca', description: 'Estampada', supplier: 'Haco', consumption: '1 un', cost: 'R$ 0,50' },
    ]
  });

  // Handlers Auxiliares
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'frontImage' | 'backImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setData(prev => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const addMeasurement = () => {
    const newRow: MeasurementRow = { id: Math.random().toString(), pointOfMeasure: 'Nova Medida', tol: '0.5', sizes: { P:'', M:'', G:'', GG:'' } };
    setData(prev => ({ ...prev, measurements: [...prev.measurements, newRow] }));
  };

  const addBomItem = () => {
    const newItem: BomItem = { id: Math.random().toString(), component: '', description: '', supplier: '', consumption: '', cost: '' };
    setData(prev => ({ ...prev, bom: [...prev.bom, newItem] }));
  };

  // Componentes de UI Reutilizáveis
  const Header = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-3 border-b-2 border-sow-black pb-2 mb-4">
      <div className="bg-sow-black text-white p-2 rounded">
        <Icon size={20} />
      </div>
      <div className="flex-1">
         <h2 className="text-xl font-bold uppercase tracking-wide">{title}</h2>
         <p className="text-xs text-gray-500">Ficha Técnica: {data.product} ({data.reference})</p>
      </div>
      <div className="text-right text-xs font-bold text-gray-400">
         SOW BRAND SYSTEM
      </div>
    </div>
  );

  const Input = ({ val, onChange, label, className = "" }: any) => (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">{label}</label>}
      <input 
        className="border-b border-gray-300 bg-transparent py-1 text-sm font-medium focus:border-sow-green focus:outline-none placeholder-gray-300 print:border-none"
        value={val}
        onChange={e => onChange(e.target.value)}
        placeholder="-"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white overflow-auto">
      {/* Barra de Ferramentas (Não impressa) */}
      <div className="max-w-[210mm] mx-auto mb-8 flex justify-between items-center print:hidden">
         <button onClick={onExit} className="flex items-center gap-2 text-gray-600 hover:text-sow-black font-bold transition-colors">
            <ArrowLeft /> Voltar
         </button>
         <div className="flex gap-2">
            <button onClick={() => window.print()} className="bg-sow-black text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 shadow-lg transition-all">
                <Printer size={18}/> Imprimir PDF
            </button>
         </div>
      </div>

      {/* --- PÁGINA 1: CAPA E DESENHO --- */}
      <div className="sheet bg-white shadow-2xl print:shadow-none mx-auto p-[10mm] mb-8 print:mb-0 print:break-after-page relative w-[210mm] min-h-[297mm]">
        <Header title="1. Visão Geral & Desenho" icon={FileText} />
        
        {/* Info Header */}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 border border-gray-200 rounded-lg mb-6 text-sm">
             <Input label="Referência" val={data.reference} onChange={(v:string) => setData({...data, reference: v})} />
             <Input label="Coleção" val={data.collection} onChange={(v:string) => setData({...data, collection: v})} />
             <Input label="Produto" val={data.product} onChange={(v:string) => setData({...data, product: v})} />
             <Input label="Estação" val={data.season} onChange={(v:string) => setData({...data, season: v})} />
             <Input label="Tam. Piloto" val={data.sampleSize} onChange={(v:string) => setData({...data, sampleSize: v})} />
             <Input label="Tecido" val={data.fabricComposition} onChange={(v:string) => setData({...data, fabricComposition: v})} />
        </div>

        {/* Desenhos Técnicos */}
        <div className="grid grid-cols-2 gap-4 h-[180mm]">
           {['frontImage', 'backImage'].map((field, idx) => (
             <div key={field} className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col relative group hover:border-sow-green transition-colors">
                <div className="absolute top-0 left-0 bg-sow-black text-white text-xs px-3 py-1 rounded-br-lg z-10">
                    {idx === 0 ? 'Frente' : 'Costas'}
                </div>
                <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
                    {(data as any)[field] ? (
                        <img src={(data as any)[field]} className="w-full h-full object-contain" alt="Technical Drawing" />
                    ) : (
                        <div className="text-center text-gray-300">
                           <Upload className="mx-auto mb-2 opacity-50" size={48} />
                           <p className="text-xs">Carregar Desenho</p>
                        </div>
                    )}
                </div>
                <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer print:hidden" 
                    onChange={e => handleImageUpload(e, field as 'frontImage' | 'backImage')} 
                />
             </div>
           ))}
        </div>
      </div>

      {/* --- PÁGINA 2: TABELA DE MEDIDAS --- */}
      <div className="sheet bg-white shadow-2xl print:shadow-none mx-auto p-[10mm] mb-8 print:mb-0 print:break-after-page relative w-[210mm] min-h-[297mm]">
        <Header title="2. Tabela de Medidas" icon={Ruler} />
        
        <div className="overflow-hidden rounded-lg border border-gray-900 mt-8">
            <table className="w-full text-sm">
                <thead className="bg-sow-black text-white">
                    <tr>
                        <th className="p-3 text-left w-1/3">Ponto de Medida (POM)</th>
                        <th className="p-3 text-center w-20">Tol. (+/-)</th>
                        {data.sizeRange.map(s => <th key={s} className="p-3 text-center w-20">{s}</th>)}
                        <th className="p-3 w-10 print:hidden"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.measurements.map((row, idx) => (
                        <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-2">
                                <input className="w-full bg-transparent font-bold text-gray-800" value={row.pointOfMeasure} onChange={(e) => {
                                    const newM = [...data.measurements];
                                    newM[idx].pointOfMeasure = e.target.value;
                                    setData({...data, measurements: newM});
                                }} />
                            </td>
                            <td className="p-2 text-center border-l border-r border-gray-200">
                                <input className="w-full text-center bg-transparent" value={row.tol} onChange={(e) => {
                                    const newM = [...data.measurements];
                                    newM[idx].tol = e.target.value;
                                    setData({...data, measurements: newM});
                                }} />
                            </td>
                            {data.sizeRange.map(size => (
                                <td key={size} className="p-2 text-center border-r border-gray-200">
                                    <input className="w-full text-center bg-transparent font-mono text-blue-600 font-bold" value={row.sizes[size]} onChange={(e) => {
                                        const newM = [...data.measurements];
                                        newM[idx].sizes[size] = e.target.value;
                                        setData({...data, measurements: newM});
                                    }} />
                                </td>
                            ))}
                            <td className="text-center print:hidden">
                                <button onClick={() => setData(prev => ({...prev, measurements: prev.measurements.filter(m => m.id !== row.id)}))} className="text-red-400 hover:text-red-600">
                                    <Trash2 size={14}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button onClick={addMeasurement} className="mt-4 flex items-center gap-2 text-sow-green font-bold text-sm border border-sow-green px-4 py-2 rounded hover:bg-green-50 print:hidden">
            <Plus size={16}/> Adicionar Medida
        </button>
      </div>

      {/* --- PÁGINA 3: COSTURA E MAQUINÁRIO --- */}
      <div className="sheet bg-white shadow-2xl print:shadow-none mx-auto p-[10mm] mb-8 print:mb-0 print:break-after-page relative w-[210mm] min-h-[297mm]">
        <Header title="3. Costura & Acabamento" icon={Scissors} />
        
        <div className="grid grid-cols-2 gap-8 mt-6">
            <div>
                <h3 className="font-bold text-gray-900 border-b border-gray-300 mb-4 pb-1">Maquinário Necessário</h3>
                <div className="space-y-2">
                    {['Reta', 'Overlock 3 Fios', 'Overlock 4 Fios', 'Galoneira', 'Travete', 'Caseadeira', 'Botoneira'].map(machine => (
                        <label key={machine} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={data.machinery.includes(machine)}
                                onChange={e => {
                                    if(e.target.checked) setData({...data, machinery: [...data.machinery, machine]});
                                    else setData({...data, machinery: data.machinery.filter(m => m !== machine)});
                                }}
                                className="w-5 h-5 text-sow-green rounded focus:ring-sow-green"
                            />
                            <span className="text-sm font-medium">{machine}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <div className="space-y-6">
                 <div>
                    <h3 className="font-bold text-gray-900 border-b border-gray-300 mb-2 pb-1">Detalhes de Fechamento</h3>
                    <textarea 
                        className="w-full h-40 border border-gray-200 rounded p-3 text-sm resize-none print:border-none print:bg-gray-50"
                        value={data.stitchingDetails}
                        onChange={e => setData({...data, stitchingDetails: e.target.value})}
                        placeholder="Ex: Utilizar fio de poliéster texturizado nas buchas da overlock..."
                    />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 border-b border-gray-300 mb-2 pb-1">Observações de Qualidade</h3>
                    <textarea 
                        className="w-full h-40 border border-gray-200 rounded p-3 text-sm resize-none print:border-none print:bg-gray-50"
                        value={data.constructionComments}
                        onChange={e => setData({...data, constructionComments: e.target.value})}
                        placeholder="Ex: Cuidar tensão da galoneira para não ondular a barra..."
                    />
                 </div>
            </div>
        </div>
      </div>

      {/* --- PÁGINA 4: ESTAMPARIA E DTF --- */}
      <div className="sheet bg-white shadow-2xl print:shadow-none mx-auto p-[10mm] mb-8 print:mb-0 print:break-after-page relative w-[210mm] min-h-[297mm]">
        <Header title="4. Estamparia & Personalização" icon={Palette} />
        
        <div className="bg-sow-black text-white p-4 rounded-lg mb-6 flex justify-between items-center print:bg-gray-900">
            <div>
                <span className="text-xs uppercase opacity-70 block">Técnica Selecionada</span>
                <span className="text-2xl font-bold">{data.printTechnique}</span>
            </div>
            <div className="flex gap-2 print:hidden">
                {['Silk', 'DTF', 'Sublimação', 'Bordado'].map(tech => (
                    <button 
                        key={tech} 
                        onClick={() => setData({...data, printTechnique: tech as any})}
                        className={`px-3 py-1 rounded text-xs font-bold border ${data.printTechnique === tech ? 'bg-white text-black' : 'border-white text-white opacity-50'}`}
                    >
                        {tech}
                    </button>
                ))}
            </div>
        </div>

        {data.printTechnique === 'DTF' && (
             <div className="mb-8 border-2 border-sow-green/20 bg-green-50/30 rounded-xl p-6">
                 <h3 className="text-sow-green font-bold text-lg mb-4 flex items-center gap-2"><Layers size={20}/> Parâmetros de Aplicação DTF</h3>
                 <div className="grid grid-cols-4 gap-6">
                     <div className="bg-white p-4 rounded border border-gray-200 text-center">
                         <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Temperatura</span>
                         <input className="w-full text-center font-bold text-xl bg-transparent outline-none" value={data.dtfSettings?.temperature} onChange={e => setData({...data, dtfSettings: {...data.dtfSettings!, temperature: e.target.value}})} />
                     </div>
                     <div className="bg-white p-4 rounded border border-gray-200 text-center">
                         <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Tempo</span>
                         <input className="w-full text-center font-bold text-xl bg-transparent outline-none" value={data.dtfSettings?.time} onChange={e => setData({...data, dtfSettings: {...data.dtfSettings!, time: e.target.value}})} />
                     </div>
                     <div className="bg-white p-4 rounded border border-gray-200 text-center">
                         <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Pressão</span>
                         <input className="w-full text-center font-bold text-xl bg-transparent outline-none" value={data.dtfSettings?.pressure} onChange={e => setData({...data, dtfSettings: {...data.dtfSettings!, pressure: e.target.value}})} />
                     </div>
                     <div className="bg-white p-4 rounded border border-gray-200 text-center">
                         <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Peeling</span>
                         <select 
                            className="w-full text-center font-bold text-xl bg-transparent outline-none appearance-none" 
                            value={data.dtfSettings?.peeling} 
                            onChange={e => setData({...data, dtfSettings: {...data.dtfSettings!, peeling: e.target.value as any}})}
                         >
                            <option value="Quente">Quente</option>
                            <option value="Frio">Frio</option>
                         </select>
                     </div>
                 </div>
             </div>
        )}

        <div className="space-y-6">
            <div className="border border-gray-200 p-4 rounded-lg">
                <Input label="Posicionamento da Arte" val={data.printPosition} onChange={(v:string) => setData({...data, printPosition: v})} className="w-full" />
            </div>
             <div className="border border-gray-200 p-4 rounded-lg">
                <Input label="Cores / Referências Pantone" val={data.printColors} onChange={(v:string) => setData({...data, printColors: v})} className="w-full" />
            </div>
        </div>
      </div>

      {/* --- PÁGINA 5: BOM & CUSTOS --- */}
      <div className="sheet bg-white shadow-2xl print:shadow-none mx-auto p-[10mm] mb-8 print:mb-0 relative w-[210mm] min-h-[297mm]">
        <Header title="5. Consumo e Materiais (BOM)" icon={Layers} />
        
        <div className="mt-6">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="text-left py-2 font-bold uppercase">Componente</th>
                        <th className="text-left py-2 font-bold uppercase">Descrição / Fornecedor</th>
                        <th className="text-center py-2 font-bold uppercase">Consumo Unit.</th>
                        <th className="text-right py-2 font-bold uppercase">Custo Est.</th>
                        <th className="w-8 print:hidden"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.bom.map((item, idx) => (
                        <tr key={item.id}>
                            <td className="p-3 align-top">
                                <input className="w-full font-bold text-gray-800 bg-transparent outline-none" placeholder="Ex: Tecido" value={item.component} onChange={e => {
                                    const newB = [...data.bom]; newB[idx].component = e.target.value; setData({...data, bom: newB});
                                }} />
                            </td>
                            <td className="p-3 align-top">
                                <input className="w-full text-gray-600 bg-transparent outline-none" placeholder="Descrição" value={item.description} onChange={e => {
                                    const newB = [...data.bom]; newB[idx].description = e.target.value; setData({...data, bom: newB});
                                }} />
                                <input className="w-full text-xs text-blue-500 bg-transparent outline-none mt-1" placeholder="Fornecedor" value={item.supplier} onChange={e => {
                                    const newB = [...data.bom]; newB[idx].supplier = e.target.value; setData({...data, bom: newB});
                                }} />
                            </td>
                            <td className="p-3 text-center align-top">
                                <input className="w-full text-center bg-transparent outline-none" placeholder="0.00" value={item.consumption} onChange={e => {
                                    const newB = [...data.bom]; newB[idx].consumption = e.target.value; setData({...data, bom: newB});
                                }} />
                            </td>
                            <td className="p-3 text-right align-top">
                                <input className="w-full text-right bg-transparent outline-none font-mono" placeholder="R$ 0,00" value={item.cost} onChange={e => {
                                    const newB = [...data.bom]; newB[idx].cost = e.target.value; setData({...data, bom: newB});
                                }} />
                            </td>
                            <td className="p-3 text-center print:hidden">
                                <button onClick={() => setData(prev => ({...prev, bom: prev.bom.filter(b => b.id !== item.id)}))} className="text-red-400 hover:text-red-600">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addBomItem} className="mt-4 flex items-center gap-2 text-sow-green font-bold text-sm border-dashed border border-sow-green px-4 py-2 rounded w-full justify-center hover:bg-green-50 print:hidden">
                <Plus size={16}/> Adicionar Novo Componente
            </button>
        </div>
      </div>
      
      {/* Styles for Printing */}
      <style>{`
        @media print {
            body { background-color: white; }
            .sheet { box-shadow: none; margin: 0; width: 100%; min-height: 297mm; }
            .print\\:break-after-page { page-break-after: always; break-after: page; }
            input, textarea { border: none !important; resize: none; }
            ::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  );
};

export default TechPack;
