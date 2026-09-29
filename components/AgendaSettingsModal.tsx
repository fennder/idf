import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { X, Plus, Trash2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const AgendaSettingsModal: React.FC<Props> = ({ onClose }) => {
  const { appointmentStatuses, addAppointmentStatus, deleteAppointmentStatus } = useApp();
  const [newStatus, setNewStatus] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus.trim()) {
      addAppointmentStatus(newStatus.trim());
      setNewStatus('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Status Personalizados</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Novo status..."
            className="flex-1 p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus size={20} />
          </button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {appointmentStatuses.map(status => (
            <div key={status} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-medium text-slate-700">{status}</span>
              <button 
                onClick={() => deleteAppointmentStatus(status)}
                className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                title="Remover"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgendaSettingsModal;
