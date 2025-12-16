
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { Client } from '../types';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('sow_clients');
    return saved ? JSON.parse(saved) : MOCK_CLIENTS;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});
  const INPUT_STYLE = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sow-green focus:border-transparent outline-none transition-all placeholder-gray-400";

  useEffect(() => { localStorage.setItem('sow_clients', JSON.stringify(clients)); }, [clients]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
        setClients(clients.map(c => c.id === formData.id ? { ...c, ...formData } as Client : c));
    } else {
        const newClient = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Client;
        setClients([...clients, newClient]);
    }
    setIsModalOpen(false); setFormData({});
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar clientes..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-sow-green shadow-sm bg-white text-gray-900" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={() => { setFormData({}); setIsModalOpen(true); }} className="bg-sow-green text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-200 transition-colors"><Plus size={20} /> Novo Cliente</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr><th className="p-4 font-semibold text-gray-600 text-sm">Nome</th><th className="p-4 font-semibold text-gray-600 text-sm">Contato</th><th className="p-4 font-semibold text-gray-600 text-sm text-right">Ações</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4"><div className="font-medium text-gray-900">{client.name}</div></td>
                <td className="p-4"><div className="text-sm text-gray-700">{client.email}</div><div className="text-sm text-gray-500">{client.phone}</div></td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setFormData(client); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"><Edit2 size={18} /></button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-full" onClick={() => setClients(clients.filter(c => c.id !== client.id))}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-900">Cliente</h3><button onClick={() => setIsModalOpen(false)}><X size={24} /></button></div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required className={INPUT_STYLE} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome" />
              <input className={INPUT_STYLE} value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Telefone" />
              <input className={INPUT_STYLE} value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" />
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancelar</button><button type="submit" className="px-6 py-2 bg-sow-green text-white font-bold rounded-lg">Salvar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
