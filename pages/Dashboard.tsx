
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole, AppointmentStatus, Transaction } from '../types';
import { Calendar, Users, TrendingUp, AlertCircle, BellRing, ArrowUpRight, ArrowDownLeft, Send, X, MessageCircle, Mail } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { patients, appointments, currentUser, updateAppointmentStatus, transactions } = useApp();
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingAppointments = appointments.filter(a => a.status === AppointmentStatus.A_CONFIRMAR);

  // Financial Alerts (Receivable and Payable)
  const financialAlerts = transactions.filter(t => t.type === 'RECEBER' || t.type === 'PAGAR');

  const stats = [
    { label: 'Hoje', value: todayAppointments.length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Pacientes', value: patients.length, icon: Users, color: 'bg-indigo-500' },
    { label: 'Pendentes', value: pendingAppointments.length, icon: AlertCircle, color: 'bg-amber-500' },
    { label: 'Recebido (Total)', value: formatCurrency(transactions.filter(t => t.type === 'RECEBIDO').reduce((a, b) => a + b.value, 0)), icon: TrendingUp, color: 'bg-emerald-500' },
  ];

  const openReminder = (t: Transaction) => {
    setSelectedTransaction(t);
    setShowReminderModal(true);
  };

  if (currentUser?.role === UserRole.PACIENTE) {
    const myPatient = patients.find(p => p.email === currentUser.email);
    const myAppointments = appointments.filter(a => a.patientId === myPatient?.id);
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Olá, {currentUser.name}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4">Meus Agendamentos</h3>
            <div className="space-y-4">
              {myAppointments.length > 0 ? myAppointments.map(app => (
                <div key={app.id} className="p-4 border border-slate-100 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{formatDate(app.date)} às {app.time}</p>
                    <p className="text-sm text-slate-500">{app.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === AppointmentStatus.CONFIRMADO ? 'bg-green-100 text-green-700' : 
                    app.status === AppointmentStatus.A_CONFIRMAR ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              )) : <p className="text-slate-500 italic">Nenhum agendamento encontrado.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedPatient = patients.find(p => p.id === selectedTransaction?.patientId);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
            <div className={`${stat.color} p-3 rounded-xl text-white mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Agenda */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-1">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Agenda de Hoje</h3>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded">{todayAppointments.length}</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {todayAppointments.length > 0 ? todayAppointments.map(app => {
              const patient = patients.find(p => p.id === app.patientId);
              return (
                <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold mr-3 text-xs">
                      {patient?.fullName?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 truncate max-w-[120px]">{patient?.fullName || 'Paciente'}</p>
                      <p className="text-[10px] text-slate-500">{app.time} - {app.location}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    app.status === AppointmentStatus.CONFIRMADO ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {app.status}
                  </span>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400">
                <Calendar className="mx-auto mb-3 opacity-20" size={48} />
                <p className="text-sm">Vazio hoje</p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Alerts - Functional */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-1">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BellRing size={20} className="text-rose-500" />
              Alertas Financeiros
            </h3>
            <span className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded">{financialAlerts.length}</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {financialAlerts.length > 0 ? financialAlerts.map(t => {
              const patient = patients.find(p => p.id === t.patientId);
              const isOverdue = new Date(t.date) < new Date(todayStr);
              return (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${t.type === 'RECEBER' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.type === 'RECEBER' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{patient?.fullName || 'Externo'}</p>
                      <p className={`text-[10px] font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-400'}`}>
                        {formatDate(t.date)} {isOverdue ? '(VENCIDO)' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${t.type === 'PAGAR' ? 'text-rose-600' : 'text-amber-600'}`}>
                      {formatCurrency(t.value)}
                    </p>
                    <button 
                      onClick={() => openReminder(t)}
                      className="text-[10px] text-indigo-600 font-bold hover:underline"
                    >
                      {t.type === 'RECEBER' ? 'Lembrar' : 'Pagar'}
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400 italic">
                <p className="text-sm">Sem pendências financeiras</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-1">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Pendentes de Agenda</h3>
            <span className="text-xs font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded">{pendingAppointments.length}</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {pendingAppointments.length > 0 ? pendingAppointments.map(app => {
              const patient = patients.find(p => p.id === app.patientId);
              return (
                <div key={app.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{patient?.fullName || 'Paciente'}</p>
                    <p className="text-[10px] text-slate-500">{formatDate(app.date)} às {app.time}</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => updateAppointmentStatus(app.id, AppointmentStatus.CONFIRMADO)}
                      className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                      title="Confirmar"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => updateAppointmentStatus(app.id, AppointmentStatus.DESMARCADO)}
                      className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                      title="Negar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400 italic">
                <p className="text-sm">Tudo em dia!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reminder Screen (Modal) */}
      {showReminderModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Enviar Cobrança/Lembrete</h2>
              <button onClick={() => setShowReminderModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-indigo-600 shadow-sm">
                      {selectedPatient?.fullName?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-900">{selectedPatient?.fullName || 'Externo'}</p>
                      <p className="text-xs text-indigo-400 font-semibold">{selectedPatient?.phone || 'Telefone não cadastrado'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-indigo-400 uppercase font-bold text-[9px]">Valor em aberto</p>
                      <p className="font-bold text-indigo-900 text-lg">{formatCurrency(selectedTransaction.value)}</p>
                    </div>
                    <div>
                      <p className="text-indigo-400 uppercase font-bold text-[9px]">Vencimento</p>
                      <p className="font-bold text-indigo-900 text-lg">{formatDate(selectedTransaction.date)}</p>
                    </div>
                  </div>
               </div>

               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-2">Mensagem Personalizada</p>
                 <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={4}
                  defaultValue={`Olá, ${selectedPatient?.fullName?.split(' ')?.[0] || 'cliente'}! Passando para lembrar da sua pendência financeira de ${formatCurrency(selectedTransaction.value)} referente ao atendimento em ${formatDate(selectedTransaction.date)}. Podemos contar com seu acerto?`}
                 />
               </div>

               <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => { alert('Lembrete enviado via WhatsApp!'); setShowReminderModal(false); }}
                    className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} /> Enviar via WhatsApp
                  </button>
                  <button 
                    onClick={() => { alert('Lembrete enviado via Email!'); setShowReminderModal(false); }}
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={20} /> Enviar via Email
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
