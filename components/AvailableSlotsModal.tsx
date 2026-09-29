import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { X, Plus, Trash2, Calendar as CalendarIcon, Clock, MapPin, User as UserIcon } from 'lucide-react';
import { formatDate } from '../utils/helpers';

interface Props {
  onClose: () => void;
}

const AvailableSlotsModal: React.FC<Props> = ({ onClose }) => {
  const { availableSlots, addAvailableSlot, deleteAvailableSlot, users } = useApp();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: 'Consultório 1',
    professional: users?.[0]?.name || ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addAvailableSlot(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Horários Liberados (Pacientes)</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data</label>
            <input 
              required
              type="date" 
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Horário</label>
            <input 
              required
              type="time" 
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Local</label>
            <select 
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            >
              <option>Consultório 1</option>
              <option>Consultório 2</option>
              <option>Sala de Exames</option>
              <option>Teleatendimento</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profissional</label>
            <input 
              required
              type="text" 
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={formData.professional}
              onChange={e => setFormData({...formData, professional: e.target.value})}
            />
          </div>
          <div className="col-span-2 flex justify-end mt-2">
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center font-bold"
            >
              <Plus size={18} className="mr-2" />
              Liberar Horário
            </button>
          </div>
        </form>

        <div className="flex-1 overflow-y-auto space-y-3">
          <h3 className="font-bold text-slate-700 mb-2">Horários Cadastrados</h3>
          {availableSlots.length === 0 ? (
            <p className="text-slate-400 text-sm italic">Nenhum horário liberado.</p>
          ) : (
            availableSlots.sort((a,b) => b.date.localeCompare(a.date)).map(slot => (
              <div key={slot.id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex gap-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <CalendarIcon size={16} className="mr-2 text-indigo-400" />
                    <span className="font-medium">{formatDate(slot.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock size={16} className="mr-2 text-indigo-400" />
                    <span className="font-medium">{slot.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <UserIcon size={16} className="mr-2 text-indigo-400" />
                    <span>{slot.professional}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${slot.isBooked ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {slot.isBooked ? 'Agendado' : 'Disponível'}
                  </span>
                  <button 
                    onClick={() => deleteAvailableSlot(slot.id)}
                    className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableSlotsModal;
