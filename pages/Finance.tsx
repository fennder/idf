
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { PaymentMethod, Transaction, AppointmentStatus } from '../types';
import { CreditCard, Download, Plus, Wallet, TrendingUp, TrendingDown, FileCheck, Send, Trash2, Pencil, X, MessageCircle, Mail } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const Finance: React.FC = () => {
  const { transactions, appointments, patients, addTransaction, updateTransaction, deleteTransaction } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransId, setSelectedTransId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    appointmentId: '',
    type: 'RECEBIDO' as Transaction['type'],
    description: 'Consulta Fonoaudiológica',
    value: 150,
    method: PaymentMethod.PIX,
    date: new Date().toISOString().split('T')[0]
  });

  const totals = {
    recebido: transactions.filter(t => t.type === 'RECEBIDO').reduce((acc, t) => acc + t.value, 0),
    receber: transactions.filter(t => t.type === 'RECEBER').reduce((acc, t) => acc + t.value, 0),
    pagar: transactions.filter(t => t.type === 'PAGAR').reduce((acc, t) => acc + t.value, 0),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = appointments.find(a => a.id === formData.appointmentId);
    
    if (isEditing && selectedTransId) {
       updateTransaction(selectedTransId, {
         ...formData,
         patientId: app?.patientId || ''
       });
    } else {
      addTransaction({
        ...formData,
        patientId: app?.patientId || ''
      });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedTransId(null);
    setFormData({
      appointmentId: '',
      type: 'RECEBIDO',
      description: 'Consulta Fonoaudiológica',
      value: 150,
      method: PaymentMethod.PIX,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditClick = (t: Transaction) => {
    setFormData({
      appointmentId: t.appointmentId,
      type: t.type,
      description: t.description,
      value: t.value,
      method: t.method || PaymentMethod.OUTRO,
      date: t.date
    });
    setSelectedTransId(t.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Excluir este lançamento financeiro permanentemente?')) {
      deleteTransaction(id);
    }
  };

  const emitReceipt = (t: Transaction) => {
    const patient = patients.find(p => p.id === t.patientId);
    alert(`Recibo Emitido!\n\nPaciente: ${patient?.fullName || 'N/A'}\nValor: ${formatCurrency(t.value)}\nData: ${formatDate(t.date)}\nForma: ${t.method}`);
  };

  const openReminder = (t: Transaction) => {
    setSelectedTransaction(t);
    setShowReminderModal(true);
  };

  const selectedPatient = patients.find(p => p.id === selectedTransaction?.patientId);

  return (
    <div className="space-y-8">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><TrendingUp size={20} /></div>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest">RECEBIDO</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totals.recebido)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg"><Wallet size={20} /></div>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest">A RECEBER</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{formatCurrency(totals.receber)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-rose-100 text-rose-600 p-2 rounded-lg"><TrendingDown size={20} /></div>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Saídas / A Pagar</span>
          </div>
          <p className="text-2xl font-bold text-rose-600">{formatCurrency(totals.pagar)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Transações Recentes</h3>
        <button 
          onClick={() => { closeModal(); setShowModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 shadow-md transition-all"
        >
          <Plus size={20} className="mr-2" />
          Novo Lançamento
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Data</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Descrição / Paciente</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Tipo</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Valor</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length > 0 ? transactions.sort((a,b) => b.date.localeCompare(a.date)).map(t => {
              const patient = patients.find(p => p.id === t.patientId);
              return (
                <tr key={t.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">{formatDate(t.date)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">{t.description}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{patient?.fullName || 'Externo'} • {t.method}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                      t.type === 'RECEBIDO' ? 'bg-green-100 text-green-700' : 
                      t.type === 'RECEBER' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${t.type === 'PAGAR' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {t.type === 'PAGAR' ? '-' : '+'}{formatCurrency(t.value)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {t.type === 'RECEBIDO' && (
                        <button onClick={() => emitReceipt(t)} className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Recibo"><FileCheck size={16} /></button>
                      )}
                      {t.type === 'RECEBER' && (
                        <button onClick={() => openReminder(t)} className="p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Lembrar"><Send size={16} /></button>
                      )}
                      <button onClick={() => handleEditClick(t)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Pencil size={16} /></button>
                      <button onClick={() => handleDeleteClick(t.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Nenhuma transação registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Agendamento Relacionado</label>
                <select 
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  value={formData.appointmentId}
                  onChange={e => setFormData({...formData, appointmentId: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  {appointments.filter(a => a.status === AppointmentStatus.CONFIRMADO).map(a => {
                    const p = patients.find(pat => pat.id === a.patientId);
                    return <option key={a.id} value={a.id}>{p?.fullName} - {formatDate(a.date)}</option>;
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipo de Transação</label>
                  <select 
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="RECEBIDO">Recebido</option>
                    <option value="RECEBER">A Receber</option>
                    <option value="PAGAR">A Pagar (Saída)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor (R$)</label>
                  <input 
                    required
                    type="number" step="0.01"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Pagamento</label>
                  <select 
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.method}
                    onChange={e => setFormData({...formData, method: e.target.value as PaymentMethod})}
                  >
                    {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data</label>
                  <input 
                    required
                    type="date"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição</label>
                <input 
                  required
                  placeholder="Ex: Consulta Fono"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 transition-all"
                >
                  {isEditing ? 'Salvar Alterações' : 'Confirmar Lançamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminder Screen (Modal) */}
      {showReminderModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Enviar Cobrança</h2>
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
                      <p className="text-xs text-indigo-400 font-semibold">{selectedPatient?.phone || 'Sem telefone'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-indigo-400 uppercase font-bold text-[9px]">Valor</p>
                      <p className="font-bold text-indigo-900 text-lg">{formatCurrency(selectedTransaction.value)}</p>
                    </div>
                    <div>
                      <p className="text-indigo-400 uppercase font-bold text-[9px]">Data</p>
                      <p className="font-bold text-indigo-900 text-lg">{formatDate(selectedTransaction.date)}</p>
                    </div>
                  </div>
               </div>

               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-2">Mensagem</p>
                 <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={4}
                  defaultValue={`Olá, ${selectedPatient?.fullName?.split(' ')?.[0] || 'cliente'}! Gostaria de lembrar do pagamento pendente de ${formatCurrency(selectedTransaction.value)}. Como podemos facilitar seu acerto?`}
                 />
               </div>

               <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => { alert('Enviado!'); setShowReminderModal(false); }}
                    className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} /> WhatsApp
                  </button>
                  <button 
                    onClick={() => { alert('Enviado!'); setShowReminderModal(false); }}
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={20} /> Email
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
