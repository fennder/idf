
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { RecordType, AppointmentStatus, MedicalRecord, Patient } from '../types';
import { 
  Activity, 
  User, 
  ClipboardList, 
  Save, 
  Stethoscope, 
  Ear, 
  Baby, 
  CheckCircle2,
  Clock,
  History,
  FileText,
  Briefcase,
  FileDown,
  Mail,
  Loader2,
  Check,
  Search
} from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { jsPDF } from 'jspdf';

const Clinic: React.FC = () => {
  const { appointments, patients, records, triages, addMedicalRecord, updateMedicalRecord } = useApp();
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [formData, setFormData] = useState({
    profissao: '',
    nomeMae: '',
    nomePai: '',
    queixaPrincipal: '',
    exameSolicitado: '',
    quantidadeSessao: 1,
    notes: '',
    testeOrelhinha: '',
    testeLinguinha: '',
    audiometria: '',
    dataInicio: '',
    dataFim: ''
  });

  const today = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter(a => a.date === today && a.status === AppointmentStatus.CONFIRMADO);

  const activeApp = appointments.find(a => a.id === selectedAppId);
  const activePatient = patients.find(p => p.id === activeApp?.patientId);
  const activeTriage = triages.find(t => t.appointmentId === selectedAppId);
  const existingRecord = records.find(r => r.appointmentId === selectedAppId);

  useEffect(() => {
    if (existingRecord) {
      setFormData({
        profissao: existingRecord.details.profissao || '',
        nomeMae: existingRecord.details.nomeMae || '',
        nomePai: existingRecord.details.nomePai || '',
        queixaPrincipal: existingRecord.details.queixaPrincipal || '',
        exameSolicitado: existingRecord.details.exameSolicitado || '',
        quantidadeSessao: existingRecord.details.quantidadeSessao || 1,
        notes: existingRecord.details.notes || '',
        testeOrelhinha: existingRecord.details.exams?.testeOrelhinha || '',
        testeLinguinha: existingRecord.details.exams?.testeLinguinha || '',
        audiometria: existingRecord.details.exams?.audiometria || '',
        dataInicio: existingRecord.details.dataInicio || new Date().toISOString(),
        dataFim: existingRecord.details.dataFim || ''
      });
    } else {
      setFormData({
        profissao: '', nomeMae: '', nomePai: '', queixaPrincipal: '', exameSolicitado: '',
        quantidadeSessao: 1, notes: '', testeOrelhinha: '', testeLinguinha: '',
        audiometria: '', dataInicio: new Date().toISOString(), dataFim: ''
      });
    }
    setSaveStatus('idle');
  }, [selectedAppId, existingRecord]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) return;

    setSaveStatus('saving');

    const recordPayload = {
      appointmentId: selectedAppId,
      type: RecordType.CONSULTA_AVALIACAO,
      details: {
        ...formData,
        exams: {
          testeOrelhinha: formData.testeOrelhinha,
          testeLinguinha: formData.testeLinguinha,
          audiometria: formData.audiometria
        }
      }
    };

    setTimeout(() => {
      if (existingRecord) {
        updateMedicalRecord(existingRecord.id, recordPayload, 'Evolução clínica atualizada no consultório.');
      } else {
        addMedicalRecord(recordPayload);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 600);
  };

  const generatePDF = () => {
    if (!activePatient) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text('Prontuário de Atendimento', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Paciente: ${activePatient.fullName}`, 20, 30);
    doc.text(`Data de Atendimento: ${formatDate(today)}`, 20, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('EVOLUÇÃO E NOTAS', 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const notesLines = doc.splitTextToSize(formData.notes, 170);
    doc.text(notesLines, 20, 60);

    if (existingRecord?.history) {
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('HISTÓRICO DE ALTERAÇÕES', 20, 20);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      existingRecord.history.forEach((h, i) => {
        doc.text(`${new Date(h.timestamp).toLocaleString()} - ${h.description} (${h.user || 'Desconhecido'})`, 20, 35 + (i * 5));
      });
    }
    
    doc.save(`atendimento_${activePatient.fullName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Clock size={16} className="text-indigo-600" />
            Agenda do Dia
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {todayApps.length > 0 ? todayApps.map(app => {
              const p = patients.find(pat => pat.id === app.patientId);
              return (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    selectedAppId === app.id 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                    : 'border-slate-50 bg-slate-50 hover:border-indigo-200'
                  }`}
                >
                  <p className="font-bold text-slate-800 text-xs">{p?.fullName}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{app.time}</p>
                </button>
              );
            }) : (
              <p className="text-[10px] text-slate-400 italic text-center py-4">Nenhum atendimento para hoje.</p>
            )}
          </div>
        </div>

        {existingRecord && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in duration-300">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
              <History size={16} className="text-amber-500" />
              Logs de Alteração
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {existingRecord.history?.slice().reverse().map((h, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-100 pb-2">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-200"></div>
                  <p className="text-[9px] font-bold text-indigo-600">{new Date(h.timestamp).toLocaleTimeString('pt-BR')}</p>
                  <p className="text-[10px] text-slate-600 leading-tight">{h.description}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">{h.user}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Form */}
      <div className="lg:col-span-9">
        {selectedAppId ? (
          <form onSubmit={handleSave} className="space-y-6 animate-in zoom-in-95 duration-300 pb-24">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-8 border-b border-slate-50 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{activePatient?.fullName}</h2>
                  <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Atendimento em Curso • {activeApp?.location}</p>
                </div>
                <div className="flex items-center gap-3">
                   {saveStatus === 'saving' && <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Sincronizando...</span>}
                   {saveStatus === 'saved' && <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><Check size={12} /> Alterações Gravadas</span>}
                </div>
              </div>

              <div className="space-y-8">
                {/* Informações do Paciente (Editáveis e com Histórico) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Profissão do Paciente</label>
                      <input 
                        type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.profissao}
                        onChange={e => setFormData({...formData, profissao: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nome da Mãe</label>
                        <input 
                          type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.nomeMae}
                          onChange={e => setFormData({...formData, nomeMae: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nome do Pai</label>
                        <input 
                          type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.nomePai}
                          onChange={e => setFormData({...formData, nomePai: e.target.value})}
                        />
                      </div>
                   </div>
                </section>

                <section>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Evolução Clínica e Notas</label>
                  <textarea 
                    required
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 text-sm leading-relaxed"
                    rows={10}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    placeholder="Inicie a evolução do atendimento..."
                  />
                </section>

                <section className="p-6 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase mb-2 block">Orelhinha</span>
                      <input className="w-full p-2 text-xs border border-slate-100 rounded-lg" value={formData.testeOrelhinha} onChange={e => setFormData({...formData, testeOrelhinha: e.target.value})} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 uppercase mb-2 block">Linguinha</span>
                      <input className="w-full p-2 text-xs border border-slate-100 rounded-lg" value={formData.testeLinguinha} onChange={e => setFormData({...formData, testeLinguinha: e.target.value})} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase mb-2 block">Audiometria</span>
                      <input className="w-full p-2 text-xs border border-slate-100 rounded-lg" value={formData.audiometria} onChange={e => setFormData({...formData, audiometria: e.target.value})} />
                    </div>
                </section>
              </div>

              <div className="fixed bottom-8 right-8 flex gap-3">
                 <button type="button" onClick={generatePDF} className="bg-white text-slate-600 p-4 rounded-2xl shadow-xl border border-slate-100 hover:bg-slate-50 transition-all">
                   <FileDown size={20} />
                 </button>
                 <button type="submit" disabled={saveStatus === 'saving'} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-2xl transition-all flex items-center gap-3">
                   {saveStatus === 'saving' ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                   {existingRecord ? 'Atualizar Prontuário' : 'Criar Prontuário'}
                 </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Search size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">Selecione um paciente para atendimento</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">A agenda de hoje mostra todos os pacientes confirmados que estão aguardando o clínico.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clinic;
