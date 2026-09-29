import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Calendar as CalendarIcon, Clock, MapPin, User as UserIcon, CheckCircle2, ArrowLeft } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { AvailableSlot } from '../types';

const ExternalScheduling: React.FC = () => {
  const { availableSlots, bookAvailableSlot, patients, addPatient, addAppointment, appointmentStatuses } = useApp();
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    attendanceType: 'Particular' as 'Particular' | 'Plano de Saúde',
    healthInsurance: ''
  });

  const available = availableSlots.filter(s => !s.isBooked).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    // Check if patient exists
    let patientId = '';
    const existingPatient = patients.find(p => p.email === formData.email || p.phone === formData.phone);
    
    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      // Add new patient and capture real ID
      patientId = addPatient({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate
      });
    }

    // Create appointment
    addAppointment({
      patientId,
      date: selectedSlot.date,
      time: selectedSlot.time,
      location: selectedSlot.location,
      status: appointmentStatuses?.[0] || 'A Confirmar',
      attendanceType: formData.attendanceType,
      healthInsurance: formData.healthInsurance
    });

    // Mark slot as booked
    bookAvailableSlot(selectedSlot.id);
    
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-slate-100">
          <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Agendamento Solicitado!</h2>
          <p className="text-slate-600 mb-8">
            Sua solicitação foi enviada com sucesso. Em breve nossa equipe entrará em contato para confirmar.
          </p>
          <button 
            onClick={() => {
              setIsSuccess(false);
              setSelectedSlot(null);
              setFormData({ fullName: '', email: '', phone: '', birthDate: '', attendanceType: 'Particular', healthInsurance: '' });
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-bold w-full"
          >
            Fazer Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">FonoFlow</h1>
          <p className="text-slate-500 text-lg">Agendamento Online de Consultas</p>
        </div>

        {!selectedSlot ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Selecione um Horário Disponível</h2>
            
            {available.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                <p>Não há horários disponíveis no momento.</p>
                <p className="text-sm mt-2">Por favor, tente novamente mais tarde ou entre em contato com a clínica.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {available.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className="text-left p-5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group bg-white"
                  >
                    <div className="flex items-center text-indigo-600 font-bold mb-3">
                      <CalendarIcon size={18} className="mr-2" />
                      {formatDate(slot.date)}
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-slate-400" />
                        {slot.time}
                      </div>
                      <div className="flex items-center">
                        <UserIcon size={16} className="mr-2 text-slate-400" />
                        {slot.professional}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-slate-400" />
                        {slot.location}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <button 
              onClick={() => setSelectedSlot(null)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors"
            >
              <ArrowLeft size={18} className="mr-1" /> Voltar aos horários
            </button>
            
            <div className="bg-indigo-50 p-4 rounded-xl mb-8 border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2">Horário Selecionado:</h3>
              <p className="text-indigo-700">
                {formatDate(selectedSlot.date)} às {selectedSlot.time} com {selectedSlot.professional}
              </p>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-6">Seus Dados</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                  <input 
                    required
                    type="email" 
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                <input 
                  required
                  type="date" 
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  value={formData.birthDate}
                  onChange={e => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Atendimento</label>
                  <select 
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.attendanceType}
                    onChange={e => setFormData({...formData, attendanceType: e.target.value as 'Particular' | 'Plano de Saúde'})}
                  >
                    <option value="Particular">Particular</option>
                    <option value="Plano de Saúde">Plano de Saúde</option>
                  </select>
                </div>
                {formData.attendanceType === 'Plano de Saúde' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Plano</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Unimed, Bradesco..."
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      value={formData.healthInsurance}
                      onChange={e => setFormData({...formData, healthInsurance: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-lg shadow-indigo-200 text-lg"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalScheduling;
