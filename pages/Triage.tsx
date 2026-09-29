
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { TriageStatus, AppointmentStatus, RecordType } from '../types';
import { Stethoscope, CheckCircle, ArrowRight, XCircle, Trash2, Eye, X, FileText, User } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const Triage: React.FC = () => {
  const { appointments, patients, triages, addTriage, deleteTriage, addMedicalRecord } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTriageId, setSelectedTriageId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [status, setStatus] = useState<TriageStatus>(TriageStatus.PASSA);

  // Novos campos para iniciar o prontuário na triagem
  const [triageDetails, setTriageDetails] = useState({
    queixaPrincipal: '',
    profissao: '',
    nomeMae: '',
    nomePai: '',
    exameSolicitado: '',
    quantidadeSessao: 1
  });

  const eligibleAppointments = appointments.filter(a => 
    a.status === AppointmentStatus.CONFIRMADO && 
    !triages.some(t => t.appointmentId === a.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = appointments.find(a => a.id === selectedApp);
    if (!app) return;

    // 1. Adiciona a Triagem (Fase 3)
    addTriage({
      appointmentId: selectedApp,
      date: app.date,
      time: app.time,
      location: app.location,
      status
    });

    // 2. Inicia o Prontuário automaticamente (Fase 4)
    addMedicalRecord({
      appointmentId: selectedApp,
      type: RecordType.CONSULTA_AVALIACAO,
      details: {
        ...triageDetails,
        notes: `Registro iniciado automaticamente via Triagem/Acolhimento. Resultado da triagem: ${status}.`,
        dataInicio: new Date().toISOString(),
      }
    });

    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedApp('');
    setStatus(TriageStatus.PASSA);
    setTriageDetails({
      queixaPrincipal: '',
      profissao: '',
      nomeMae: '',
      nomePai: '',
      exameSolicitado: '',
      quantidadeSessao: 1
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este registro de triagem?')) {
      deleteTriage(id);
    }
  };

  const handleView = (id: string) => {
    setSelectedTriageId(id);
    setShowViewModal(true);
  };

  const selectedTriage = triages.find(t => t.id === selectedTriageId);
  const selectedAppInfo = appointments.find(a => a.id === selectedTriage?.appointmentId);
  const patientInfo = patients.find(p => p.id === selectedAppInfo?.patientId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Triagem / Acolhimento</h2>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 shadow-md transition-all"
        >
          <Stethoscope size={20} className="mr-2" />
          Iniciar Acolhimento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Paciente / Data</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Local</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Resultado</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {triages.length > 0 ? triages.map(t => {
              const app = appointments.find(a => a.id === t.appointmentId);
              const patient = patients.find(p => p.id === app?.patientId);
              return (
                <tr key={t.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{patient?.fullName || 'Desconhecido'}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase">{formatDate(t.date)} • {t.time}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{t.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {t.status === TriageStatus.PASSA && <CheckCircle size={16} className="text-green-500 mr-2" />}
                      {t.status === TriageStatus.ENCAMINHA && <ArrowRight size={16} className="text-blue-500 mr-2" />}
                      {t.status === TriageStatus.FALHA && <XCircle size={16} className="text-red-500 mr-2" />}
                      <span className={`font-bold text-xs uppercase ${
                        t.status === TriageStatus.PASSA ? 'text-green-700' : 
                        t.status === TriageStatus.ENCAMINHA ? 'text-blue-700' : 'text-red-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleView(t.id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Ver Detalhes"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Nenhum acolhimento realizado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showViewModal && selectedTriage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Detalhes do Acolhimento</h2>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Paciente</p>
                  <p className="font-bold text-slate-800">{patientInfo?.fullName}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Resultado</p>
                    <p className={`font-bold ${selectedTriage.status === TriageStatus.PASSA ? 'text-green-600' : 'text-indigo-600'}`}>{selectedTriage.status}</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Horário</p>
                    <p className="font-bold text-slate-800">{selectedTriage.time}</p>
                 </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Local</p>
                  <p className="font-bold text-slate-800">{selectedTriage.location}</p>
               </div>
               <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 italic">Este acolhimento gerou um registro automático no prontuário do paciente.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Novo Acolhimento e Triagem</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <label className="block text-xs font-bold text-indigo-600 uppercase mb-2">1. Selecionar Agendamento</label>
                <select 
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={selectedApp}
                  onChange={e => setSelectedApp(e.target.value)}
                >
                  <option value="">Selecione um agendamento confirmado...</option>
                  {eligibleAppointments.map(a => {
                    const p = patients.find(pat => pat.id === a.patientId);
                    return <option key={a.id} value={a.id}>{p?.fullName} - {formatDate(a.date)} ({a.time})</option>;
                  })}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase">2. Informações para o Prontuário</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Profissão</label>
                    <input 
                      type="text" 
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={triageDetails.profissao}
                      onChange={e => setTriageDetails({...triageDetails, profissao: e.target.value})}
                      placeholder="Ex: Estudante"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Qtd. Sessões Previstas</label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={triageDetails.quantidadeSessao}
                      onChange={e => setTriageDetails({...triageDetails, quantidadeSessao: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nome da Mãe</label>
                    <input 
                      type="text" 
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={triageDetails.nomeMae}
                      onChange={e => setTriageDetails({...triageDetails, nomeMae: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Pai</label>
                    <input 
                      type="text" 
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={triageDetails.nomePai}
                      onChange={e => setTriageDetails({...triageDetails, nomePai: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Queixa Principal</label>
                  <textarea 
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows={3}
                    placeholder="Descreva o motivo principal da busca por atendimento..."
                    value={triageDetails.queixaPrincipal}
                    onChange={e => setTriageDetails({...triageDetails, queixaPrincipal: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Exame Solicitado / Encaminhamento</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={triageDetails.exameSolicitado}
                    onChange={e => setTriageDetails({...triageDetails, exameSolicitado: e.target.value})}
                    placeholder="Ex: Audiometria Tonal"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-3">3. Resultado da Triagem</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(TriageStatus).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-3 px-2 rounded-xl text-[10px] font-bold transition-all border-2 flex flex-col items-center gap-1 ${
                        status === s 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                      }`}
                    >
                      {s === TriageStatus.PASSA && <CheckCircle size={16} />}
                      {s === TriageStatus.ENCAMINHA && <ArrowRight size={16} />}
                      {s === TriageStatus.FALHA && <XCircle size={16} />}
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={!selectedApp}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={18} /> Salvar e Iniciar Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Triage;
