
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  FileText, 
  CreditCard, 
  BarChart3, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Bell,
  AlertCircle,
  BellRing,
  Activity,
  BookOpen
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, logout, transactions, patients } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return <>{children}</>;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.GERENTE, UserRole.ATENDENTE, UserRole.PACIENTE] },
    { id: 'agenda', label: 'Agenda', icon: Calendar, roles: [UserRole.ADMIN, UserRole.GERENTE, UserRole.ATENDENTE, UserRole.PACIENTE] },
    { id: 'patients', label: 'Pacientes', icon: Users, roles: [UserRole.ADMIN, UserRole.GERENTE, UserRole.ATENDENTE] },
    { id: 'triage', label: 'Triagem', icon: Stethoscope, roles: [UserRole.ADMIN, UserRole.GERENTE, UserRole.ATENDENTE] },
    { id: 'records', label: 'Prontuários', icon: FileText, roles: [UserRole.ADMIN, UserRole.GERENTE, UserRole.ATENDENTE] },
    { id: 'clinic', label: 'Consultório', icon: Activity, roles: [UserRole.ADMIN, UserRole.GERENTE, UserRole.ATENDENTE] },
    { id: 'finance', label: 'Financeiro', icon: CreditCard, roles: [UserRole.ADMIN, UserRole.GERENTE] },
    { id: 'reports', label: 'Relatórios', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.GERENTE] },
    { id: 'postcare', label: 'Pós-Atendimento', icon: MessageSquare, roles: [UserRole.ADMIN, UserRole.ATENDENTE] },
    { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.GERENTE, UserRole.ATENDENTE, UserRole.PACIENTE] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));
  
  const roleTranslations: Record<string, string> = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.GERENTE]: 'Gerente',
    [UserRole.ATENDENTE]: 'Atendente',
    [UserRole.PACIENTE]: 'Paciente',
  };
  const translatedRole = roleTranslations[currentUser.role] || currentUser.role;

  // Financial Alerts (Upcoming/Overdue)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const financialAlerts = transactions.filter(t => {
    if (t.type !== 'RECEBER' && t.type !== 'PAGAR') return false;
    const txDate = new Date(t.date);
    txDate.setHours(0, 0, 0, 0);
    return txDate <= nextWeek;
  });
  const financialAlertsCount = financialAlerts.length;

  return (
    <div className="min-h-screen flex text-slate-800">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <span className={`font-bold text-indigo-600 text-xl truncate ${!isSidebarOpen ? 'hidden' : ''}`}>FonoFlow</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-100 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 mt-6 px-3 space-y-2">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon size={20} />
              <span className={`ml-3 font-medium ${!isSidebarOpen ? 'hidden' : ''}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`mb-4 flex items-center ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {(currentUser.name?.[0] || '?').toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-400 truncate uppercase">{translatedRole}</p>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className={`w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${!isSidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            <span className={`ml-3 font-medium ${!isSidebarOpen ? 'hidden' : ''}`}>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-40">
          <h1 className="text-xl font-bold text-slate-800">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="ml-auto flex items-center gap-6">
             <div className="relative" ref={notificationRef}>
               <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-2 transition-all rounded-full ${isNotificationsOpen ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
               >
                 {financialAlertsCount > 0 ? <BellRing size={22} className="animate-bounce" /> : <Bell size={22} />}
                 {financialAlertsCount > 0 && (
                   <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                     {financialAlertsCount}
                   </span>
                 )}
               </button>

               {isNotificationsOpen && (
                 <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                     <h3 className="font-bold text-sm">Alertas e Notificações</h3>
                     <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">{financialAlertsCount} pendências</span>
                   </div>
                   <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-50">
                     {financialAlerts.length > 0 ? financialAlerts.map(t => {
                       const patient = patients.find(p => p.id === t.patientId);
                       const isOverdue = new Date(t.date) < new Date();
                       return (
                         <div 
                           key={t.id} 
                           className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group" 
                           onClick={() => { setActiveTab('finance'); setIsNotificationsOpen(false); }}
                         >
                           <div className="flex gap-3">
                             <div className={`p-2 rounded-lg h-fit transition-transform group-hover:scale-110 ${t.type === 'RECEBER' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                               <AlertCircle size={16} />
                             </div>
                             <div className="flex-1">
                               <div className="flex justify-between items-start">
                                 <p className="text-xs font-bold text-slate-800">{t.type === 'RECEBER' ? 'Cobrança Pendente' : 'Conta a Pagar'}</p>
                                 <span className="text-[9px] font-bold text-indigo-500 uppercase">Ir para</span>
                               </div>
                               <p className="text-[10px] text-slate-500 mb-1 line-clamp-1">{patient?.fullName || t.description} - {formatCurrency(t.value)}</p>
                               <div className="flex justify-between items-center">
                                 <p className={`text-[9px] font-semibold ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
                                   Vence em: {formatDate(t.date)} {isOverdue && '(ATRASADO)'}
                                 </p>
                               </div>
                             </div>
                           </div>
                         </div>
                       );
                     }) : (
                       <div className="p-12 text-center">
                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                           <Bell size={24} />
                         </div>
                         <p className="text-slate-400 text-xs italic">Nenhuma notificação pendente.</p>
                       </div>
                     )}
                   </div>
                   {financialAlertsCount > 0 && (
                     <button 
                      onClick={() => { setActiveTab('finance'); setIsNotificationsOpen(false); }}
                      className="w-full p-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors text-center"
                     >
                       Gerenciar Pendências
                     </button>
                   )}
                 </div>
               )}
             </div>
             <div className="h-8 w-[1px] bg-slate-200"></div>
             <span className="text-sm text-slate-500 hidden sm:block">{new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' })}</span>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
