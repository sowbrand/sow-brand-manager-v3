
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { Client } from '../types';
import { supabase } from '../supabaseClient';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [saving, setSaving] = useState(false);

  const INPUT_STYLE = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sow-green focus:border-transparent outline-none transition-all placeholder-gray-400";
  const LABEL_STYLE = "block text-sm font-bold text-gray-700 mb-1";

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('clients')
          .update({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            observations: formData.observations,
            address: formData.address,
            cnpj: formData.cnpj
          })
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('clients')
          .insert([{
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            observations: formData.observations,
            address: formData.address,
            cnpj: formData.cnpj
          }]);

        if (error) throw error;
      }

      await fetchClients();
      setIsModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      setClients(clients.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir cliente.');
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar clientes..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-sow-green focus:ring-1 focus:ring-sow-green shadow-sm bg-white text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setFormData({}); setIsModalOpen(true); }}
          className="bg-sow-green hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-200 transition-colors"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {loading ? (
         <div className="flex justify-center p-10"><Loader2 className="animate-spin text-sow-green" size={32} /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm">Nome / Marca</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Contato</th>
                <th className="p-4 font-semibold text-gray-600 text-sm hidden lg:table-cell">Observações</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Nenhum cliente encontrado.</td>
                </tr>
              )}
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{client.name}</div>
                    {client.cnpj && <div className="text-xs text-gray-400">{client.cnpj}</div>}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-700">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <p className="text-sm text-gray-500 truncate max-w-xs">{client.observations || '-'}</p>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                          onClick={() => { setFormData(client); setIsModalOpen(true); }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                      >
                          <Edit2 size={18} />
                      </button>
                      <button 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                          onClick={() => handleDelete(client.id)}
                      >
                          <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">{formData.id ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className={LABEL_STYLE}>Nome da Marca/Cliente</label>
                <input required className={INPUT_STYLE} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Confecções Silva" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_STYLE}>CNPJ</label>
                  <input className={INPUT_STYLE} value={formData.cnpj || ''} onChange={e => setFormData({...formData, cnpj: e.target.value})} placeholder="00.000.000/0000-00" />
                </div>
                <div>
                  <label className={LABEL_STYLE}>Telefone</label>
                  <input className={INPUT_STYLE} value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(00) 00000-0000" />
                </div>
              </div>
              <div>
                <label className={LABEL_STYLE}>Email</label>
                <input type="email" className={INPUT_STYLE} value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@dominio.com" />
              </div>
              <div>
                <label className={LABEL_STYLE}>Endereço</label>
                <input className={INPUT_STYLE} value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Rua, Número, Bairro" />
              </div>
              <div>
                <label className={LABEL_STYLE}>Observações</label>
                <textarea className={INPUT_STYLE + " h-24 resize-none"} value={formData.observations || ''} onChange={e => setFormData({...formData, observations: e.target.value})} placeholder="Detalhes adicionais..." />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-sow-green text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-100 disabled:opacity-70 flex items-center gap-2">
                  {saving && <Loader2 className="animate-spin" size={16} />} Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
