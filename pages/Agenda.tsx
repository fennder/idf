
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { AppointmentStatus, UserRole } from '../types';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Pencil, Trash2, X, Settings, Globe } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import AgendaSettingsModal from '../components/AgendaSettingsModal';
import AvailableSlotsModal from '../components/AvailableSlotsModal';

const Agenda: React.FC = () => {
  const { patients, appointments, addAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus, currentUser, appointmentStatuses, addPatient } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    fullName: '',
    cpf: '',
    birthDate: '',
    phone: '',
    email: ''
  });
  
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: 'Consultório 1',
    status: appointmentStatuses?.[0] || 'A Confirmar',
    attendanceType: 'Particular' as 'Particular' | 'Plano de Saúde',
    healthInsurance: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let currentPatientId = formData.patientId;
    
    if (isNewPatient && !isEditing) {
      currentPatientId = addPatient({
        fullName: newPatientData.fullName,
        cpf: newPatientData.cpf,
        birthDate: newPatientData.birthDate,
        phone: newPatientData.phone,
        email: newPatientData.email,
        address: '',
        notes: ''
      });
    }

    if (isEditing && selectedAppId) {
      updateAppointment(selectedAppId, { ...formData, patientId: currentPatientId });
    } else {
      addAppointment({ ...formData, patientId: currentPatientId });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedAppId(null);
    setIsNewPatient(false);
    setNewPatientData({
      fullName: '',
      cpf: '',
      birthDate: '',
      phone: '',
      email: ''
    });
    setFormData({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      location: 'Consultório 1',
      status: appointmentStatuses?.[0] || 'A Confirmar',
      attendanceType: 'Particular',
      healthInsurance: ''
    });
  };

  const handleEditClick = (app: any) => {
    setFormData({
      patientId: app.patientId,
      date: app.date,
      time: app.time,
      location: app.location,
      status: app.status,
      attendanceType: app.attendanceType || 'Particular',
      healthInsurance: app.healthInsurance || ''
    });
    setSelectedAppId(app.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Excluir agendamento permanentemente?')) {
      deleteAppointment(id);
    }
  };

  const filteredAppointments = currentUser?.role === UserRole.PACIENTE
    ? appointments.filter(a => {
        const p = patients.find(pat => pat.email === currentUser.email);
        return a.patientId === p?.id;
      })
    : appointments;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciamento de Agenda</h2>
        <div className="flex gap-3">
          {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.GERENTE) && (
            <>
              <button 
                onClick={() => setShowSlotsModal(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-700 shadow-md transition-all"
                title="Liberar Horários para Pacientes"
              >
                <Globe size={20} className="mr-2" />
                Agendas Externas
              </button>
              <button 
                onClick={() => setShowSettingsModal(true)}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 shadow-md transition-all"
                title="Configurar Status"
              >
                <Settings size={20} className="mr-2" />
                Status
              </button>
            </>
          )}
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 shadow-md transition-all"
          >
            <Plus size={20} className="mr-2" />
            Novo Agendamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.length > 0 ? filteredAppointments.sort((a,b) => b.date.localeCompare(a.date)).map(app => {
          const patient = patients.find(p => p.id === app.patientId);
          return (
            <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all relative group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-900">{patient?.fullName || 'Paciente Removido'}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {app.patientId}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    app.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 
                    app.status === 'A Confirmar' ? 'bg-amber-100 text-amber-700' : 
                    app.status === 'Desmarcado' ? 'bg-rose-100 text-rose-700' : 
                    app.status === 'Faltou' ? 'bg-red-100 text-red-700' : 
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-slate-500">
                  <CalendarIcon size={16} className="mr-2 text-indigo-400" />
                  {formatDate(app.date)}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock size={16} className="mr-2 text-indigo-400" />
                  {app.time}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <MapPin size={16} className="mr-2 text-indigo-400" />
                  {app.location}
                </div>
                {app.attendanceType && (
                  <div className="flex items-center text-sm text-slate-500">
                    <span className="font-semibold text-slate-600 mr-1">Atendimento:</span>
                    {app.attendanceType} {app.attendanceType === 'Plano de Saúde' && app.healthInsurance ? `(${app.healthInsurance})` : ''}
                  </div>
                )}
              </div>

              {currentUser?.role !== UserRole.PACIENTE && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(app)}
                    className="flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(app.id)}
                    className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center text-slate-400">
            <CalendarIcon size={48} className="mx-auto mb-4 opacity-10" />
            Nenhum agendamento encontrado.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Alterar Agendamento' : 'Novo Agendamento'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentUser?.role !== UserRole.PACIENTE ? (
                <div className="space-y-4">
                  {!isEditing && (
                    <div className="flex items-center gap-2 mb-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setIsNewPatient(false)}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${!isNewPatient ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Paciente Existente
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsNewPatient(true)}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${isNewPatient ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Novo Paciente
                      </button>
                    </div>
                  )}

                  {!isNewPatient ? (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Selecionar Paciente</label>
                      <select 
                        required
                        className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                        value={formData.patientId}
                        onChange={e => setFormData({...formData, patientId: e.target.value})}
                      >
                        <option value="">Selecione um paciente...</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.fullName}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <h3 className="text-sm font-bold text-indigo-900 mb-2">Dados do Novo Paciente</h3>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Nome Completo</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Ex: João da Silva"
                          className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          value={newPatientData.fullName}
                          onChange={e => setNewPatientData({...newPatientData, fullName: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">CPF</label>
                          <input 
                            required
                            type="text" 
                            placeholder="000.000.000-00"
                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={newPatientData.cpf}
                            onChange={e => setNewPatientData({...newPatientData, cpf: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Nascimento</label>
                          <input 
                            required
                            type="date" 
                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={newPatientData.birthDate}
                            onChange={e => setNewPatientData({...newPatientData, birthDate: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Telefone</label>
                          <input 
                            required
                            type="text" 
                            placeholder="(00) 00000-0000"
                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={newPatientData.phone}
                            onChange={e => setNewPatientData({...newPatientData, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
                          <input 
                            type="email" 
                            placeholder="email@exemplo.com"
                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={newPatientData.email}
                            onChange={e => setNewPatientData({...newPatientData, email: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-indigo-50 rounded-xl mb-4">
                  <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Paciente</p>
                  <p className="font-semibold text-indigo-800">{currentUser.name}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                  <input 
                    required
                    type="date" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Horário</label>
                  <input 
                    required
                    type="time" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Local</label>
                <select 
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                >
                  <option>Consultório 1</option>
                  <option>Consultório 2</option>
                  <option>Sala de Exames</option>
                  <option>Sala de Triagem</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Atendimento</label>
                  <select 
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
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
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      value={formData.healthInsurance}
                      onChange={e => setFormData({...formData, healthInsurance: e.target.value})}
                    />
                  </div>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select 
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    {appointmentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

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
                  {isEditing ? 'Salvar Alterações' : 'Confirmar Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSettingsModal && <AgendaSettingsModal onClose={() => setShowSettingsModal(false)} />}
      {showSlotsModal && <AvailableSlotsModal onClose={() => setShowSlotsModal(false)} />}
    </div>
  );
};

export default Agenda;
