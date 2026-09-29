
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider, useApp } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Agenda from './pages/Agenda';
import Triage from './pages/Triage';
import Records from './pages/Records';
import Finance from './pages/Finance';
import Reports from './pages/Reports';
import PostCare from './pages/PostCare';
import Clinic from './pages/Clinic';
import KnowledgeBase from './pages/KnowledgeBase';
import ExternalScheduling from './pages/ExternalScheduling';
import PublicPanel from './pages/PublicPanel';
import NotificationManager from './components/NotificationManager';
import { UserRole } from './types';

const AppContent = () => {
  const { currentUser, login } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);

  // Check for external scheduling route
  if (window.location.pathname === '/agendamento-paciente') {
    return <ExternalScheduling />;
  }

  // Check for public panel route
  if (window.location.pathname === '/painel') {
    return <PublicPanel />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">FonoFlow</h1>
            <p className="text-slate-500">Sistema de Gestão Clínica</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Perfil de Acesso</label>
              <select 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value={UserRole.ADMIN}>Administrador</option>
                <option value={UserRole.GERENTE}>Gerente</option>
                <option value={UserRole.ATENDENTE}>Atendente</option>
                <option value={UserRole.PACIENTE}>Paciente</option>
              </select>
            </div>
            <button 
              onClick={() => login(email || 'admin@fono.com', role)}
              className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-4"
            >
              Entrar no Sistema
            </button>
            <div className="flex gap-2 mt-4">
              <a 
                href="/painel"
                className="flex-1 bg-slate-800 text-white text-center p-3 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-lg"
              >
                Tela de Chamada
              </a>
              <a 
                href="/agendamento-paciente"
                className="flex-1 bg-emerald-600 text-white text-center p-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Agendamento Público
              </a>
            </div>
            <div className="text-center mt-6 text-xs text-slate-400">
              Simulação de acesso modular - Fase 1
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'patients': return <Patients />;
      case 'agenda': return <Agenda />;
      case 'triage': return <Triage />;
      case 'records': return <Records />;
      case 'finance': return <Finance />;
      case 'reports': return <Reports />;
      case 'postcare': return <PostCare />;
      case 'clinic': return <Clinic />;
      case 'knowledge': return <KnowledgeBase />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <NotificationManager />
      {renderContent()}
    </Layout>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <AppProvider>
    <AppContent />
  </AppProvider>
);
