
import React, { useState } from 'react';
import Login from './pages/Login';
import ProductionSystem from './pages/ProductionSystem';
import TechPack from './pages/TechPack';
import Budget from './pages/Budget';
import { Shirt, FileText, DollarSign, LogOut } from 'lucide-react';

const App: React.FC = () => {
  // Estado de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('sow_auth') === 'true');
  
  // Estado de Navegação (Roteamento simples)
  const [currentModule, setCurrentModule] = useState<'hub' | 'production' | 'techpack' | 'budget'>('hub');

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('sow_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sow_auth');
    setCurrentModule('hub');
  };

  // Se não autenticado, mostra Login
  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  // Se autenticado, verifica qual módulo exibir
  if (currentModule === 'production') return <ProductionSystem onExit={() => setCurrentModule('hub')} onLogout={handleLogout} />;
  if (currentModule === 'techpack') return <TechPack onExit={() => setCurrentModule('hub')} />;
  if (currentModule === 'budget') return <Budget onExit={() => setCurrentModule('hub')} />;

  // HUB PRINCIPAL (Landing Page do Sistema)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-sow-black rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl transform hover:rotate-3 transition-transform">
             <span className="text-4xl font-bold text-sow-green">S</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Hub de Ferramentas</h1>
          <p className="text-gray-500 text-lg">Sow Brand Manager System v2.0</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Produção */}
            <button 
                onClick={() => setCurrentModule('production')} 
                className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-sow-green transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
            >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-sow-green mb-6 group-hover:scale-110 transition-transform">
                    <Shirt size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gestão de Produção</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Controle completo de chão de fábrica, status de pedidos e fornecedores.</p>
            </button>

            {/* Card Ficha Técnica */}
            <button 
                onClick={() => setCurrentModule('techpack')} 
                className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-sow-green transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
            >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ficha Técnica</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Criação de documentos técnicos padronizados para impressão A4.</p>
            </button>

            {/* Card Orçamento */}
            <button 
                onClick={() => setCurrentModule('budget')} 
                className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-sow-green transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
            >
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                    <DollarSign size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gerador de Orçamento</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Propostas comerciais automáticas com cálculo de Private Label.</p>
            </button>
        </div>

        <div className="mt-16 text-center border-t border-gray-200 pt-8">
            <button 
                onClick={handleLogout} 
                className="text-gray-400 hover:text-red-500 flex items-center justify-center gap-2 mx-auto transition-colors font-medium text-sm"
            >
                <LogOut size={18} /> Encerrar Sessão
            </button>
        </div>
      </div>
    </div> 
  );
};

export default App;
