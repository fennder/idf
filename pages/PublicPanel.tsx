import React, { useEffect, useState } from 'react';
import { useApp } from '../store/AppContext';
import { Clock, Calendar, Volume2 } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const PublicPanel: React.FC = () => {
  const { appointments, patients } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments
    .filter(a => a.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Determine current/next
  // In a real panel, this would be updated manually by the attendant, 
  // but let's just list them sorted by time.
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="p-6 bg-slate-800 border-b border-slate-700 flex justify-between items-center shadow-md">
        <h1 className="text-4xl font-bold text-indigo-400">FonoFlow</h1>
        <div className="flex items-center gap-6 text-2xl font-semibold">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar size={28} className="text-indigo-400" />
            {formatDate(todayStr)}
          </div>
          <div className="flex items-center gap-2 text-white bg-slate-700 px-4 py-2 rounded-xl">
            <Clock size={28} className="text-emerald-400" />
            {currentTime.toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-hidden flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-300 tracking-wide uppercase">
          Painel de Atendimentos
        </h2>

        <div className="flex-1 flex gap-8">
          {/* Queued Patients */}
          <div className="flex-1 bg-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col border border-slate-700">
            <h3 className="text-xl font-bold mb-6 text-indigo-300 border-b border-slate-700 pb-4">
              Agendamentos de Hoje
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
              {todayAppointments.length > 0 ? todayAppointments.map((app, index) => {
                const patient = patients.find(p => p.id === app.patientId);
                const isPast = app.time < currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) && app.status !== 'A Confirmar' && app.status !== 'Confirmado';
                
                // Mask patient last name
                const names = patient?.fullName.split(' ') || ['Paciente'];
                const displayName = names.length > 1 
                  ? `${names[0]} ${names[names.length - 1].charAt(0)}.` 
                  : names[0];

                return (
                  <div 
                    key={app.id} 
                    className={`flex items-center p-6 rounded-2xl border-l-8 transition-colors ${
                      index === 0 && app.status === 'Confirmado'
                        ? 'border-emerald-500 bg-slate-700 shadow-lg' 
                        : isPast 
                          ? 'border-slate-600 bg-slate-800/50 opacity-60' 
                          : 'border-indigo-500 bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <div className="w-24 text-3xl font-black text-slate-400">
                      {app.time}
                    </div>
                    <div className="flex-1 ml-6">
                      <h4 className="text-3xl font-bold text-white tracking-wide">{displayName}</h4>
                      <p className="text-slate-400 text-lg">{app.location}</p>
                    </div>
                    <div>
                      <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase ${
                        app.status === 'Confirmado' ? 'bg-emerald-500/20 text-emerald-400' :
                        app.status === 'A Confirmar' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Calendar size={64} className="mb-4 opacity-50" />
                  <p className="text-2xl">Nenhum agendamento para hoje.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicPanel;
