
import React, { useState } from 'react';
import { ArrowLeft, Printer, Plus, Trash2 } from 'lucide-react';
import { BudgetItem, BudgetProposal } from '../types';

const SERVICES = [
  { label: 'Desenvolvimento de Marca', sku: 'DESMAR', price: 1500 },
  { label: 'Private Label', sku: 'PRILAB', price: 0 },
  { label: 'Personalização', sku: 'PER', price: 50 },
  { label: 'Consultoria', sku: 'CON', price: 300 },
  { label: 'Mentoria', sku: 'MEN', price: 500 },
];

const Budget: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [proposal, setProposal] = useState<BudgetProposal>(() => {
     const lastNum = parseInt(localStorage.getItem('budget_seq') || '0');
     return {
         id: Math.random().toString(),
         number: lastNum + 1,
         year: new Date().getFullYear(),
         clientName: '', clientAddress: '', clientContact: '',
         date: new Date().toLocaleDateString('pt-BR'),
         deliveryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
         items: [],
         observations: ''
     }
  });

  const addItem = () => {
      setProposal(prev => ({
          ...prev,
          items: [...prev.items, { id: Math.random().toString(), type: 'Private Label', sku: 'PRILAB', quantity: 1, unitPrice: 0 }]
      }));
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: any) => {
      setProposal(prev => ({
          ...prev,
          items: prev.items.map(item => {
              if (item.id !== id) return item;
              if (field === 'type') {
                  const service = SERVICES.find(s => s.label === value);
                  return { ...item, type: value, sku: service?.sku || '', unitPrice: service?.price || 0 };
              }
              return { ...item, [field]: value };
          })
      }));
  };

  const removeItem = (id: string) => {
      setProposal(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const total = proposal.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white">
       <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
         <button onClick={onExit} className="flex items-center gap-2 text-gray-600 hover:text-sow-black font-bold"><ArrowLeft /> Voltar</button>
         <button onClick={() => { localStorage.setItem('budget_seq', proposal.number.toString()); window.print(); }} className="bg-sow-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800"><Printer size={18}/> Imprimir</button>
      </div>

      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[297mm] p-[15mm] text-black">
          <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
              <div className="w-24 h-24 bg-sow-black text-white flex items-center justify-center font-bold text-4xl rounded-lg">S</div>
              <div className="text-right">
                  <h1 className="text-2xl font-bold uppercase mb-2">Orçamento Comercial</h1>
                  <p className="text-sm text-gray-600">Sow Brand Indústria e Comércio</p>
                  <p className="text-sm text-gray-600">26.224.938/0001-89 | (47) 99197-6744</p>
                  <p className="text-sm text-gray-600">São Francisco do Sul - SC</p>
                  <p className="text-sm text-blue-600 font-bold mt-1">www.sowbrandbrasil.com.br</p>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                  <div className="bg-gray-100 p-2 font-bold text-sm border-l-4 border-sow-green">DADOS DO CLIENTE</div>
                  <input className="w-full border-b border-gray-300 py-1 text-sm focus:outline-none" placeholder="Nome do Cliente" value={proposal.clientName} onChange={e => setProposal({...proposal, clientName: e.target.value})} />
                  <input className="w-full border-b border-gray-300 py-1 text-sm focus:outline-none" placeholder="Endereço Completo" value={proposal.clientAddress} onChange={e => setProposal({...proposal, clientAddress: e.target.value})} />
                  <input className="w-full border-b border-gray-300 py-1 text-sm focus:outline-none" placeholder="Telefone / Email" value={proposal.clientContact} onChange={e => setProposal({...proposal, clientContact: e.target.value})} />
              </div>
              <div className="space-y-2">
                   <div className="bg-gray-100 p-2 font-bold text-sm border-l-4 border-sow-black">DETALHES DO PEDIDO</div>
                   <div className="flex justify-between text-sm border-b border-gray-200 py-1"><span>Número:</span> <span className="font-bold">{String(proposal.number).padStart(3, '0')}/{proposal.year}</span></div>
                   <div className="flex justify-between text-sm border-b border-gray-200 py-1"><span>Data:</span> <span>{proposal.date}</span></div>
                   <div className="flex justify-between text-sm border-b border-gray-200 py-1"><span>Previsão Entrega:</span> <span>{proposal.deliveryDate}</span></div>
              </div>
          </div>

          <div className="mb-8">
              <table className="w-full text-sm">
                  <thead className="bg-sow-black text-white">
                      <tr>
                          <th className="p-2 text-left">ITEM / SERVIÇO</th>
                          <th className="p-2 text-center">SKU</th>
                          <th className="p-2 text-center">QTD</th>
                          <th className="p-2 text-right">UNIT. (R$)</th>
                          <th className="p-2 text-right">TOTAL (R$)</th>
                          <th className="p-2 w-8 print:hidden"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                      {proposal.items.map(item => (
                          <tr key={item.id}>
                              <td className="p-2">
                                  <select className="w-full bg-transparent outline-none appearance-none font-medium" value={item.type} onChange={e => updateItem(item.id, 'type', e.target.value)}>
                                      {SERVICES.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                                  </select>
                              </td>
                              <td className="p-2 text-center text-gray-500">{item.sku}</td>
                              <td className="p-2 text-center"><input type="number" className="w-16 text-center bg-transparent border border-gray-200 rounded" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value))} /></td>
                              <td className="p-2 text-right"><input type="number" className="w-24 text-right bg-transparent border border-gray-200 rounded" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))} /></td>
                              <td className="p-2 text-right font-bold">{(item.quantity * item.unitPrice).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                              <td className="p-2 text-center print:hidden"><button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              <button onClick={addItem} className="mt-4 flex items-center gap-2 text-sow-green font-bold text-sm hover:bg-green-50 px-3 py-2 rounded print:hidden"><Plus size={16}/> Adicionar Item</button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="font-bold text-xs text-gray-500 uppercase mb-2">Observações Gerais</p>
                  <textarea className="w-full bg-transparent text-sm h-24 resize-none outline-none" placeholder="Digite aqui condições de pagamento, detalhes..." value={proposal.observations} onChange={e => setProposal({...proposal, observations: e.target.value})} />
              </div>
              <div className="w-full md:w-64 bg-sow-black text-white p-6 rounded-lg shadow-lg">
                  <p className="text-sm text-gray-400 mb-1">Valor Total</p>
                  <p className="text-3xl font-bold">{total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Budget;
