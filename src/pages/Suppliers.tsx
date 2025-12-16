
import React, { useState, useEffect } from 'react';
import { Plus, Factory, Edit2, Trash2, X } from 'lucide-react';
import { MOCK_SUPPLIERS } from '../constants';
import { Supplier, SupplierCategory } from '../types';

const CATEGORIES: SupplierCategory[] = ['Malha', 'Modelagem', 'Corte', 'Costura', 'Bordado', 'Estampa Silk', 'Impressão DTF', 'Prensa DTF', 'Acabamento'];
const INPUT_STYLE = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sow-green focus:border-transparent outline-none transition-all placeholder-gray-400";

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('sow_suppliers');
    return saved ? JSON.parse(saved) : MOCK_SUPPLIERS;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => { localStorage.setItem('sow_suppliers', JSON.stringify(suppliers)); }, [suppliers]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
        setSuppliers(suppliers.map(s => s.id === formData.id ? { ...s, ...formData } as Supplier : s));
    } else {
        const newSupplier = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Supplier;
        setSuppliers([...suppliers, newSupplier]);
    }
    setIsModalOpen(false); setFormData({});
  };

  const filteredSuppliers = selectedCategory === 'Todos' ? suppliers : suppliers.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto custom-scrollbar">
          <button onClick={() => setSelectedCategory('Todos')} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold ${selectedCategory === 'Todos' ? 'bg-sow-black text-white' : 'bg-white border'}`}>Todos</button>
          {CATEGORIES.map(cat => (
             <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold ${selectedCategory === cat ? 'bg-sow-black text-white' : 'bg-white border'}`}>{cat}</button>
          ))}
        </div>
        <button onClick={() => { setFormData({ category: 'Costura' }); setIsModalOpen(true); }} className="bg-sow-green text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg"><Plus size={20} /> Novo Fornecedor</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-lg"><Factory className="text-gray-400" size={24} /></div>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium border border-gray-200">{supplier.category}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{supplier.name}</h3>
            <p className="text-sm text-gray-500 mb-6">Contato: <span className="font-medium text-gray-700">{supplier.contact}</span></p>
            <div className="flex gap-2 border-t border-gray-50 pt-4">
                <button onClick={() => { setFormData(supplier); setIsModalOpen(true); }} className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-blue-50 text-blue-600"><Edit2 size={14}/> Editar</button>
                <button onClick={() => setSuppliers(suppliers.filter(s => s.id !== supplier.id))} className="px-3 py-2 text-sm border rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-900">Fornecedor</h3><button onClick={() => setIsModalOpen(false)}><X className="text-gray-400" /></button></div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required className={INPUT_STYLE} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome da Empresa" />
              <select className={INPUT_STYLE} value={formData.category || 'Costura'} onChange={e => setFormData({...formData, category: e.target.value as SupplierCategory})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <input required className={INPUT_STYLE} value={formData.contact || ''} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="Contato" />
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancelar</button><button type="submit" className="px-6 py-2 bg-sow-green text-white font-bold rounded-lg">Salvar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
