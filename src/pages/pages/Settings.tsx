import React, { useState, useEffect } from 'react';
import { Save, Building, Phone, FileText, MapPin } from 'lucide-react';
import { CompanySettings } from '../types';
import { supabase } from '../supabaseClient';

// Configuração padrão caso o banco esteja vazio
const DEFAULT_SETTINGS: CompanySettings = {
  name: '', cnpj: '', address: '', contact: '', logoUrl: '', footerText: ''
};

const Settings: React.FC<{ settings: CompanySettings; onSave: (s: CompanySettings) => void }> = ({ onSave }) => {
  const [formData, setFormData] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // 1. Buscar dados do Supabase ao abrir a tela
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single(); // Pega apenas a primeira linha (ID 1)

      if (error && error.code !== 'PGRST116') { // PGRST116 é erro de "não encontrado", normal no começo
        console.error('Erro ao buscar:', error);
      }

      if (data) {
        // Adapta os campos do banco (snake_case) para o app (camelCase)
        setFormData({
          name: data.name,
          cnpj: data.cnpj,
          address: data.address,
          contact: data.contact,
          logoUrl: data.logo_url || '',
          footerText: data.footer_text || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Salvar dados no Supabase
  const handleSave = async () => {
    try {
      setLoading(true);
      // Salva sempre no ID 1 para manter uma única configuração
      const { error } = await supabase
        .from('company_settings')
        .upsert({ 
          id: 1,
          name: formData.name,
          cnpj: formData.cnpj,
          address: formData.address,
          contact: formData.contact,
          logo_url: formData.logoUrl,
          footer_text: formData.footerText
        });

      if (error) throw error;
      
      alert('Configurações salvas na nuvem com sucesso!');
      onSave(formData); // Atualiza o estado local do App pai
    } catch (error) {
      alert('Erro ao salvar no banco de dados.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="p-8 text-center">Carregando configurações...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Building className="text-sow-green" /> Configurações da Empresa
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
           <label className="block text-sm font-bold text-gray-700 mb-2">Logotipo (URL da Imagem)</label>
           <input 
             className="w-full p-2 border rounded" 
             placeholder="https://exemplo.com/logo.png"
             value={formData.logoUrl}
             onChange={e => handleChange('logoUrl', e.target.value)}
           />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Empresa</label>
          <div className="flex items-center border rounded p-2 bg-gray-50">
            <Building size={18} className="text-gray-400 mr-2" />
            <input className="bg-transparent w-full outline-none" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">CNPJ</label>
          <div className="flex items-center border rounded p-2 bg-gray-50">
            <FileText size={18} className="text-gray-400 mr-2" />
            <input className="bg-transparent w-full outline-none" value={formData.cnpj} onChange={e => handleChange('cnpj', e.target.value)} />
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">Contato / Telefone</label>
           <div className="flex items-center border rounded p-2 bg-gray-50">
             <Phone size={18} className="text-gray-400 mr-2" />
             <input className="bg-transparent w-full outline-none" value={formData.contact} onChange={e => handleChange('contact', e.target.value)} />
           </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">Endereço</label>
           <div className="flex items-center border rounded p-2 bg-gray-50">
             <MapPin size={18} className="text-gray-400 mr-2" />
             <input className="bg-transparent w-full outline-none" value={formData.address} onChange={e => handleChange('address', e.target.value)} />
           </div>
        </div>

        <div className="col-span-2">
           <label className="block text-sm font-bold text-gray-700 mb-2">Texto do Rodapé (PDF)</label>
           <input className="w-full p-2 border rounded" value={formData.footerText} onChange={e => handleChange('footerText', e.target.value)} />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        className="mt-8 w-full bg-sow-green text-white font-bold py-3 rounded-lg hover:bg-[#65a803] transition-colors flex items-center justify-center gap-2"
      >
        <Save size={20} /> {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </div>
  );
};

export default Settings;