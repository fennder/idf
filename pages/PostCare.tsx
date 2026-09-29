
import React from 'react';
import { useApp } from '../store/AppContext';
import { MessageSquare, Phone, Mail, Clock, Send, Bell } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const PostCare: React.FC = () => {
  const { appointments, patients } = useApp();

  // Filtrar atendimentos realizados nos últimos dias
  const completedAppointments = appointments.filter(a => a.status === 'Confirmado');

  const sendMessage = (patientName: string, type: 'whatsapp' | 'email') => {
    alert(`Enviando lembrete via ${type.toUpperCase()} para ${patientName}...\n\n"Olá! Gostaríamos de saber como foi sua última sessão e lembrar sobre os cuidados recomendados."`);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
          <div className="flex justify-between items-start mb-4">
            <Bell size={24} />
            <span className="text-xs font-bold opacity-70 uppercase tracking-wider">Ações Pendentes</span>
          </div>
          <h4 className="text-3xl font-bold mb-1">12</h4>
          <p className="text-sm opacity-80">Lembretes de retorno para esta semana</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 text-sm font-medium mb-1">Taxa de Reidelidade</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">85%</span>
            <span className="text-emerald-500 text-xs font-bold mb-1">+2.4%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg">Próximos Acompanhamentos</h3>
          <MessageSquare className="text-indigo-600" size={20} />
        </div>
        <div className="divide-y divide-slate-100">
          {completedAppointments.length > 0 ? completedAppointments.map(app => {
            const patient = patients.find(p => p.id === app.patientId);
            return (
              <div key={app.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg mr-4">
                    {patient?.fullName?.[0] || '?'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{patient?.fullName}</h4>
                    <p className="text-xs text-slate-400">Último atendimento: {formatDate(app.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => sendMessage(patient?.fullName || '', 'whatsapp')}
                    className="flex-1 sm:flex-none p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 text-xs font-bold"
                  >
                    <Send size={14} /> WhatsApp
                  </button>
                  <button 
                    onClick={() => sendMessage(patient?.fullName || '', 'email')}
                    className="flex-1 sm:flex-none p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-xs font-bold"
                  >
                    <Mail size={14} /> Email
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="p-12 text-center text-slate-400 italic">
              Nenhum acompanhamento pendente no momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCare;
