
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { Search, UserPlus, Phone, Mail, CheckCircle, X, Pencil, Trash2, Eye } from 'lucide-react';
// Added calculateAge to the import list from helpers
import { formatDate, calculateAge } from '../utils/helpers';

const Patients: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});
  
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (showToast.show) {
      const timer = setTimeout(() => {
        setShowToast({show: false, msg: ''});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAddOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedPatientId) {
      updatePatient(selectedPatientId, formData);
      setShowToast({show: true, msg: 'Paciente atualizado com sucesso!'});
    } else {
      addPatient(formData);
      setShowToast({show: true, msg: 'Paciente cadastrado com sucesso!'});
    }
    closeModals();
  };

  const handleEditClick = (p: any) => {
    setFormData({
      fullName: p.fullName,
      birthDate: p.birthDate,
      phone: p.phone,
      email: p.email
    });
    setSelectedPatientId(p.id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleViewClick = (p: any) => {
    setSelectedPatientId(p.id);
    setFormData({
      fullName: p.fullName,
      birthDate: p.birthDate,
      phone: p.phone,
      email: p.email
    });
    setShowViewModal(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Deseja realmente excluir este paciente? Esta ação não pode ser desfeita.')) {
      deletePatient(id);
      setShowToast({show: true, msg: 'Paciente removido com sucesso!'});
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setIsEditing(false);
    setSelectedPatientId(null);
    setFormData({ fullName: '', birthDate: '', phone: '', email: '' });
  };

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {showToast.show && (
        <div className="fixed top-20 right-8 z-[110] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/50">
            <div className="bg-white/20 p-1 rounded-full">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">Sucesso!</p>
              <p className="text-xs opacity-90">{showToast.msg}</p>
            </div>
            <button onClick={() => setShowToast({show: false, msg: ''})} className="ml-4 hover:bg-white/10 p-1 rounded transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { closeModals(); setShowAddModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <UserPlus size={20} className="mr-2" />
          Novo Paciente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Paciente</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Idade</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase">Contato</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.length > 0 ? filteredPatients.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{p.fullName}</div>
                  <div className="text-xs text-slate-400">ID: {p.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-600">{p.age} anos</div>
                  <div className="text-xs text-slate-400">{formatDate(p.birthDate)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <Phone size={14} className="mr-2 opacity-50" /> {p.phone}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail size={14} className="mr-2 opacity-50" /> {p.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => handleViewClick(p)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Visualizar Detalhes"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                      title="Editar Paciente"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(p.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Excluir Paciente"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  Nenhum paciente cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Visualização */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Dados do Paciente</h2>
              <button onClick={closeModals} className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Nome Completo</p>
                  <p className="font-semibold text-slate-800">{formData.fullName}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Nascimento</p>
                  <p className="font-semibold text-slate-800">{formatDate(formData.birthDate)} ({calculateAge(formData.birthDate)} anos)</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Telefone</p>
                  <p className="font-semibold text-slate-800">{formData.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Email</p>
                  <p className="font-semibold text-slate-800 truncate" title={formData.email}>{formData.email}</p>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => handleEditClick(selectedPatient)}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Pencil size={18} /> Editar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cadastro/Edição */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">{isEditing ? 'Editar Paciente' : 'Cadastrar Paciente'}</h2>
            <form onSubmit={handleAddOrEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                <input 
                  required
                  type="date" 
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                  value={formData.birthDate}
                  onChange={e => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="(00) 00000-0000"
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="exemplo@email.com"
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition-all shadow-lg shadow-indigo-100"
                >
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
