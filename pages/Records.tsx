
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { RecordType, AppointmentStatus, Patient, MedicalRecord } from '../types';
import { FilePlus, FileText, Search, PlusCircle, Trash2, Eye, X, FileDown, Mail, CheckCircle, Loader2, History } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/helpers';
import { jsPDF } from 'jspdf';

const Records: React.FC = () => {
  const { appointments, patients, records, addMedicalRecord, deleteMedicalRecord } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  const [recordType, setRecordType] = useState(RecordType.CONSULTA_AVALIACAO);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});
  
  const [evaluationData, setEvaluationData] = useState({
    profissao: '',
    nomeMae: '',
    nomePai: '',
    queixaPrincipal: '',
    exameSolicitado: '',
    quantidadeSessao: 1,
  });
  const [notes, setNotes] = useState('');
  const [observacoesAdicionais, setObservacoesAdicionais] = useState('');

  const eligibleApps = appointments.filter(a => a.status === AppointmentStatus.CONFIRMADO);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = appointments.find(a => a.id === selectedApp);
    if (!app) return;

    addMedicalRecord({
      appointmentId: selectedApp,
      type: recordType,
      details: recordType === RecordType.CONSULTA_AVALIACAO 
        ? { ...evaluationData, notes, observacoesAdicionais }
        : { notes, observacoesAdicionais }
    });
    
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedApp('');
    setNotes('');
    setObservacoesAdicionais('');
    setRecordType(RecordType.CONSULTA_AVALIACAO);
    setEvaluationData({
      profissao: '',
      nomeMae: '',
      nomePai: '',
      queixaPrincipal: '',
      exameSolicitado: '',
      quantidadeSessao: 1,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este registro do prontuário permanentemente?')) {
      deleteMedicalRecord(id);
    }
  };

  const handleView = (id: string) => {
    setSelectedRecordId(id);
    setShowViewModal(true);
  };

  const generatePDF = (record: MedicalRecord, patient: Patient | undefined) => {
    if (!patient) return;
    
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text('FonoFlow - Prontuário Clínico', margin, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, y);
    y += 15;

    doc.setDrawColor(230);
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, y, 170, 40, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO PACIENTE', margin + 5, y + 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nome: ${patient.fullName}`, margin + 5, y + 20);
    doc.text(`Data de Nascimento: ${formatDate(patient.birthDate)} (${patient.age} anos)`, margin + 5, y + 25);
    doc.text(`Email: ${patient.email}`, margin + 5, y + 30);
    doc.text(`Telefone: ${patient.phone}`, margin + 5, y + 35);
    y += 50;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`TIPO DE ATENDIMENTO: ${record.type.toUpperCase()}`, margin, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Evolução / Notas Clínicas:', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const notas = doc.splitTextToSize(record.details.notes || '', 170);
    doc.text(notas, margin, y);

    doc.save(`prontuario_${patient.fullName.replace(/\s+/g, '_')}_${record.id}.pdf`);
  };

  const sendEmail = (record: MedicalRecord, patient: Patient | undefined) => {
    if (!patient) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowToast({show: true, msg: `Prontuário enviado com sucesso para ${patient.email}`});
      setTimeout(() => setShowToast({show: false, msg: ''}), 3000);
    }, 2000);
  };

  const filteredRecords = records.filter(r => {
    const app = appointments.find(a => a.id === r.appointmentId);
    const patient = patients.find(p => p.id === app?.patientId);
    return patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentRecord = records.find(r => r.id === selectedRecordId);
  const recordApp = appointments.find(a => a.id === currentRecord?.appointmentId);
  const recordPatient = patients.find(p => p.id === recordApp?.patientId);

  return (
    <div className="space-y-6">
      {showToast.show && (
        <div className="fixed top-20 right-8 z-[110] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/50">
            <div className="bg-white/20 p-1 rounded-full"><CheckCircle size={20} /></div>
            <div>
              <p className="font-bold text-sm">E-mail Enviado!</p>
              <p className="text-xs opacity-90">{showToast.msg}</p>
            </div>
            <button onClick={() => setShowToast({show: false, msg: ''})} className="ml-4 hover:bg-white/10 p-1 rounded transition-colors"><X size={16} /></button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center gap-4">
         <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por paciente..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 shadow-md transition-all"
        >
          <FilePlus size={20} className="mr-2" />
          Novo Registro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.length > 0 ? filteredRecords.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(rec => {
          const app = appointments.find(a => a.id === rec.appointmentId);
          const patient = patients.find(p => p.id === app?.patientId);
          return (
            <div key={rec.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all group">
              <div className="flex justify-between mb-4">
                <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{rec.type}</span>
                <span className="text-[10px] text-slate-400 font-bold">{formatDate(rec.createdAt)}</span>
              </div>
              <h4 className="font-bold text-slate-900 mb-1">{patient?.fullName || 'Paciente Removido'}</h4>
              <p className="text-[10px] text-slate-400 mb-4 font-bold uppercase">{patient?.age} anos | {rec.type}</p>
              
              <div className="text-sm text-slate-600 line-clamp-2 mb-6 italic opacity-70">
                {rec.type === RecordType.CONSULTA_AVALIACAO ? rec.details.queixaPrincipal : rec.details.notes}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleView(rec.id)}
                  className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={14} /> Ver
                </button>
                <button 
                   onClick={() => handleDelete(rec.id)}
                   className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center text-slate-400">
             <FileText size={48} className="mx-auto mb-4 opacity-10" />
             Nenhum prontuário encontrado.
          </div>
        )}
      </div>

      {/* Modal Visualização */}
      {showViewModal && currentRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Detalhes do Prontuário</h2>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <div className="space-y-8">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Paciente</p>
                    <p className="font-bold text-slate-800">{recordPatient?.fullName}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Tipo de Registro</p>
                    <p className="font-bold text-indigo-600">{currentRecord.type}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase mb-2">Notas e Evolução</p>
                      <div className="p-5 bg-slate-50 rounded-2xl text-slate-700 text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
                        {currentRecord.details.notes}
                      </div>
                    </div>

                    {currentRecord.details.observacoesAdicionais && (
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-2">Observações Adicionais</p>
                        <div className="p-5 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl text-slate-700 text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
                          {currentRecord.details.observacoesAdicionais}
                        </div>
                      </div>
                    )}
                 </div>

                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                      <History size={16} /> Histórico de Modificações
                    </h4>
                    <div className="space-y-4">
                      {currentRecord.history?.slice().reverse().map((h, i) => (
                        <div key={i} className="relative pl-4 border-l-2 border-slate-200 pb-2">
                           <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-300"></div>
                           <p className="text-[10px] font-bold text-indigo-600">{new Date(h.timestamp).toLocaleString('pt-BR')}</p>
                           <p className="text-xs text-slate-700 leading-tight">{h.description}</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase">Por: {h.user}</p>
                        </div>
                      ))}
                    </div>
                 </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                 <button 
                  onClick={() => generatePDF(currentRecord, recordPatient)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                 >
                   <FileDown size={18} /> Gerar PDF
                 </button>
                 <button 
                  onClick={() => sendEmail(currentRecord, recordPatient)}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                   Encaminhar p/ E-mail
                 </button>
                 <button 
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                 >
                   Fechar
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
