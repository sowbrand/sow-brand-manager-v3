import React, { useState, useEffect } from 'react';
import { Save, Building } from 'lucide-react';
import { CompanySettings } from '../types';
import { supabase } from '../supabaseClient';

const Settings: React.FC<{ settings: CompanySettings; onSave: (s: CompanySettings) => void }> = ({ onSave }) => {
  const [formData, setFormData] = useState<CompanySettings>({
    name: '', cnpj: '', address: '', contact: '', logoUrl: '', footerText: ''
  });
  const [loading, setLoading] = useState(true);

  // 1. Buscar do Banco ao carregar
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('company_settings').select('*').single();
      if (data) {
        setFormData({
          name: data.name,
          cnpj: data.cnpj,
          address: data.address,
          contact: data.contact,
          logoUrl: data.logo_url || '',
          footerText: data.footer_text || ''
        });
      }
    } catch (error) {
      console.log('Erro ao buscar dados ou tabela vazia.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Salvar no Banco
  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from('company_settings').upsert({ 
          id: 1,
          name: formData.name,
          cnpj: formData.cnpj,
          address: formData.address,
          contact: formData.contact,
          logo_url: formData.logoUrl,
          footer_text: formData.footerText
        });

      if (error) throw error;
      alert('SUCESSO: Dados salvos na nuvem!');
      onSave(formData); 
    } catch (error) {
      alert('Erro ao salvar.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="p-8">Carregando configurações...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Note que a caixa azul NÃO existe neste código */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Building className="text-sow-green" /> Configurações da Empresa (Banco de Dados Ativo)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
           <label className="block text-sm font-bold text-gray-700 mb-2">Logotipo (URL)</label>
           <input className="w-full p-2 border rounded" value={formData.logoUrl} onChange={e => handleChange('logoUrl', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Empresa</label>
          <input className="w-full p-2 border rounded" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">CNPJ</label>
          <input className="w-full p-2 border rounded" value={formData.cnpj} onChange={e => handleChange('cnpj', e.target.value)} />
        </div>
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">Contato</label>
           <input className="w-full p-2 border rounded" value={formData.contact} onChange={e => handleChange('contact', e.target.value)} />
        </div>
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">Endereço</label>
           <input className="w-full p-2 border rounded" value={formData.address} onChange={e => handleChange('address', e.target.value)} />
        </div>
        <div className="col-span-2">
           <label className="block text-sm font-bold text-gray-700 mb-2">Texto do Rodapé</label>
           <input className="w-full p-2 border rounded" value={formData.footerText} onChange={e => handleChange('footerText', e.target.value)} />
        </div>
      </div>

      <button onClick={handleSave} disabled={loading} className="mt-8 w-full bg-sow-green text-white font-bold py-3 rounded-lg hover:bg-green-700">
        {loading ? 'Salvando...' : 'Salvar Alterações na Nuvem ☁️'}
      </button>
    </div>
  );
};

export default Settings;