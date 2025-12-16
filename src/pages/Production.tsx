
import React, { useState, useEffect } from 'react';
import { MOCK_ORDERS, MOCK_SUPPLIERS, MOCK_CLIENTS } from '../constants';
import { ProductionOrder, ProductionStatus, Supplier, Client, ProductionStage } from '../types';
import { ChevronDown, ChevronUp, Plus, Search, Filter, X } from 'lucide-react';

const Production: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>(() => {
    const saved = localStorage.getItem('sow_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });
  const [suppliers] = useState<Supplier[]>(() => { const saved = localStorage.getItem('sow_suppliers'); return saved ? JSON.parse(saved) : MOCK_SUPPLIERS; });
  const [clients] = useState<Client[]>(() => { const saved = localStorage.getItem('sow_clients'); return saved ? JSON.parse(saved) : MOCK_CLIENTS; });
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState<{ clientId: string; product: string; quantity: string; modelingOrigin: 'Sow Brand' | 'Cliente'; }>({ clientId: '', product: '', quantity: '', modelingOrigin: 'Sow Brand' });

  const INPUT_STYLE = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sow-green focus:border-transparent outline-none transition-all placeholder-gray-400";
  const LABEL_STYLE = "block text-sm font-bold text-gray-700 mb-1";
  const STAGES_CONFIG = [{ key: 'modelagem', label: 'Modelagem' }, { key: 'corte', label: 'Corte' }, { key: 'costura', label: 'Costura' }, { key: 'bordado', label: 'Bordado' }, { key: 'silk', label: 'Silk' }, { key: 'dtfPrint', label: 'DTF Print' }, { key: 'dtfPress', label: 'DTF Press' }, { key: 'acabamento', label: 'Acabamento' }];

  useEffect(() => { localStorage.setItem('sow_orders', JSON.stringify(orders)); }, [orders]);

  const handleCreateOrder = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newOrder.clientId || !newOrder.product || !newOrder.quantity) return;
      const client = clients.find(c => c.id === newOrder.clientId);
      const emptyStage: ProductionStage = { status: 'Pendente' };
      const orderToAdd: ProductionOrder = {
          id: Math.random().toString(36).substr(2, 9),
          orderNumber: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
          clientId: newOrder.clientId,
          clientName: client ? client.name : 'Cliente Removido',
          product: newOrder.product,
          quantity: parseInt(newOrder.quantity),
          modelingOrigin: newOrder.modelingOrigin,
          createdAt: new Date().toLocaleDateString('pt-BR'),
          stages: { modelagem: { ...emptyStage }, corte: { ...emptyStage }, costura: { ...emptyStage }, bordado: { ...emptyStage }, silk: { ...emptyStage }, dtfPrint: { ...emptyStage }, dtfPress: { ...emptyStage }, acabamento: { ...emptyStage } }
      };
      setOrders([orderToAdd, ...orders]); setIsModalOpen(false); setNewOrder({ clientId: '', product: '', quantity: '', modelingOrigin: 'Sow Brand' });
  };

  const updateStage = (orderId: string, stageKey: string, field: string, value: string) => {
    setOrders(prev => prev.map(order => {
        if (order.id !== orderId) return order;
        return { ...order, stages: { ...order.stages, [stageKey]: { ...(order.stages as any)[stageKey], [field]: value } } };
    }));
  };

  const getStatusColor = (status: ProductionStatus) => {
    switch (status) { case 'Concluído': return 'bg-green-100 text-green-800 border-green-200'; case 'Em Andamento': return 'bg-blue-100 text-blue-800 border-blue-200'; case 'Atrasado': return 'bg-red-100 text-red-800 border-red-200'; default: return 'bg-white text-gray-500 border-gray-300'; }
  };

  return (
    <div className="flex flex-col h-full space-y-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sow-green shadow-sm text-gray-900 bg-white" /></div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-sow-green text-white rounded-xl text-sm font-bold shadow-lg"><Plus size={16} /> Novo Pedido</button>
      </div>

      <div className="hidden md:flex flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="min-w-max border-collapse">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-3 text-left border-r border-gray-200 bg-gray-50 sticky left-0 z-20 w-48">Pedido / Cliente</th>
                <th className="p-3 text-center border-r border-gray-200 bg-gray-50 w-20">Qtd</th>
                {STAGES_CONFIG.map((stage) => (<th key={stage.key} colSpan={4} className="p-2 text-center border-r border-gray-200 bg-gray-100/50">{stage.label}</th>))}
              </tr>
              <tr>
                <th className="p-2 bg-gray-50 sticky left-0 z-20 border-r border-gray-200"></th><th className="p-2 bg-gray-50 border-r border-gray-200"></th>
                {STAGES_CONFIG.map((stage) => (
                    <React.Fragment key={`${stage.key}-sub`}>
                        <th className="px-2 py-1 bg-white border-b border-r border-gray-200 text-[10px] w-32 font-medium">Forn.</th>
                        <th className="px-2 py-1 bg-white border-b border-r border-gray-200 text-[10px] w-16 font-medium">Ent.</th>
                        <th className="px-2 py-1 bg-white border-b border-r border-gray-200 text-[10px] w-16 font-medium">Sai.</th>
                        <th className="px-2 py-1 bg-white border-b border-r border-gray-200 text-[10px] w-24 font-medium">Status</th>
                    </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-3 border-r border-gray-100 sticky left-0 bg-white hover:bg-gray-50 z-10"><div className="font-bold text-gray-900">{order.orderNumber}</div><div className="text-xs text-gray-500 truncate w-40">{order.clientName}</div></td>
                  <td className="p-3 text-center border-r border-gray-100 font-medium text-gray-900">{order.quantity}</td>
                  {STAGES_CONFIG.map((stage) => {
                    const stageData = (order.stages as any)[stage.key];
                    return (
                        <React.Fragment key={`${order.id}-${stage.key}`}>
                            <td className="p-1 border-r border-gray-100"><select className="w-full bg-transparent text-[11px] border-none focus:ring-0 p-0 text-gray-600" value={stageData?.supplierId || ''} onChange={(e) => updateStage(order.id, stage.key, 'supplierId', e.target.value)}><option value="" disabled>-</option><option value="Interno">Interno</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></td>
                            <td className="p-1 border-r border-gray-100 text-xs text-center p-0"><input type="text" className="w-full h-full text-center bg-transparent border-none text-[11px]" placeholder="-" value={stageData?.dateIn || ''} onChange={(e) => updateStage(order.id, stage.key, 'dateIn', e.target.value)}/></td>
                            <td className="p-1 border-r border-gray-100 text-xs text-center p-0"><input type="text" className="w-full h-full text-center bg-transparent border-none text-[11px]" placeholder="-" value={stageData?.dateOut || ''} onChange={(e) => updateStage(order.id, stage.key, 'dateOut', e.target.value)}/></td>
                            <td className="p-1 border-r border-gray-100"><select value={stageData?.status || 'Pendente'} onChange={(e) => updateStage(order.id, stage.key, 'status', e.target.value)} className={`w-full px-1 py-0.5 rounded text-[10px] font-bold border text-center appearance-none ${getStatusColor(stageData?.status)}`}><option value="Pendente">Pend.</option><option value="Em Andamento">Andam.</option><option value="Concluído">OK</option><option value="Atrasado">Atras.</option></select></td>
                        </React.Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                  <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-xl text-gray-900">Novo Pedido</h3><button onClick={() => setIsModalOpen(false)}><X className="text-gray-400" /></button></div>
                  <form onSubmit={handleCreateOrder} className="space-y-4">
                      <select required className={INPUT_STYLE} value={newOrder.clientId} onChange={e => setNewOrder({...newOrder, clientId: e.target.value})}><option value="">-- Cliente --</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                      <input required className={INPUT_STYLE} placeholder="Produto" value={newOrder.product} onChange={e => setNewOrder({...newOrder, product: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4"><input required type="number" className={INPUT_STYLE} placeholder="Qtd" value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: e.target.value})} /><select className={INPUT_STYLE} value={newOrder.modelingOrigin} onChange={e => setNewOrder({...newOrder, modelingOrigin: e.target.value as any})}><option value="Sow Brand">Sow Brand</option><option value="Cliente">Cliente</option></select></div>
                      <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancelar</button><button type="submit" className="bg-sow-green text-white px-6 py-2 rounded-lg font-bold">Criar</button></div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Production;
