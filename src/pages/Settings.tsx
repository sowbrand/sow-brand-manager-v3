
import React, { useState, useEffect, useRef } from 'react';
import { Save, Building, Phone, Link as LinkIcon, Image as ImageIcon, CheckCircle, UploadCloud, FileText } from 'lucide-react';
import { CompanySettings } from '../types';

interface SettingsProps { settings: CompanySettings; onSave: (settings: CompanySettings) => void; }

const INPUT_STYLE = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sow-green focus:border-transparent outline-none transition-all placeholder-gray-400";
const LABEL_STYLE = "block text-sm font-bold text-gray-700 mb-1";

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setFormData(settings); }, [settings]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000); };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => { setFormData(prev => ({ ...prev, logoUrl: reader.result as string })); };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-2">
               <label className={LABEL_STYLE}>Logotipo</label>
               <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                   <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-sm">{formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain" /> : <span className="text-xs text-gray-400">Sem Logo</span>}</div>
                   <div><input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} /><button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">Carregar Imagem</button></div>
               </div>
            </div>
            <div className="space-y-1"><label className={LABEL_STYLE}>Nome da Empresa</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={INPUT_STYLE} /></div>
            <div className="space-y-1"><label className={LABEL_STYLE}>CNPJ</label><input type="text" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className={INPUT_STYLE} /></div>
            <div className="space-y-1"><label className={LABEL_STYLE}>Telefone</label><input type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className={INPUT_STYLE} /></div>
            <div className="space-y-1"><label className={LABEL_STYLE}>Endereço</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={INPUT_STYLE} /></div>
          </div>
          <div className="pt-6 flex items-center justify-end gap-4">
             {showSuccess && <span className="text-sow-green font-bold animate-pulse flex items-center gap-2"><CheckCircle size={18}/> Salvo!</span>}
             <button type="submit" className="bg-sow-green text-white px-8 py-3 rounded-xl font-bold shadow-lg">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
