
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Dashboard from './Dashboard';
import Clients from './Clients';
import Suppliers from './Suppliers';
import Production from './Production';
import Settings from './Settings';
import { CompanySettings } from '../types';
import { DEFAULT_COMPANY_SETTINGS } from '../constants';

interface ProductionSystemProps {
    onExit: () => void;
    onLogout: () => void;
}

const ProductionSystem: React.FC<ProductionSystemProps> = ({ onExit, onLogout }) => {
  // Carrega configurações do localStorage ou usa padrão
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('sow_settings');
    return saved ? JSON.parse(saved) : DEFAULT_COMPANY_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSaveSettings = (newSettings: CompanySettings) => {
    setCompanySettings(newSettings);
    localStorage.setItem('sow_settings', JSON.stringify(newSettings));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'clients': return <Clients />;
      case 'suppliers': return <Suppliers />;
      case 'production': return <Production />;
      case 'settings': return <Settings settings={companySettings} onSave={handleSaveSettings} />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onNavigate={setActiveTab} 
      onLogout={onLogout}
      onExit={onExit} // Passa a função de voltar para o Layout exibir o botão
      companySettings={companySettings}
    >
      {renderContent()}
    </Layout>
  );
};

export default ProductionSystem;
