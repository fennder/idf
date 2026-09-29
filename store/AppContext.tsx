
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Patient, Appointment, Triage, MedicalRecord, Transaction, UserRole, AppState, AppointmentStatus, AvailableSlot } from '../types';
import { calculateAge } from '../utils/helpers';

interface AppContextType extends AppState {
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  // Patients
  addPatient: (p: Omit<Patient, 'id' | 'age'>) => string;
  updatePatient: (id: string, p: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  // Appointments
  addAppointment: (a: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, a: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: string, status: string) => void;
  deleteAppointment: (id: string) => void;
  // Triage
  addTriage: (t: Omit<Triage, 'id'>) => void;
  updateTriage: (id: string, t: Partial<Triage>) => void;
  deleteTriage: (id: string) => void;
  // Medical Records
  addMedicalRecord: (r: Omit<MedicalRecord, 'id' | 'createdAt' | 'history'>) => void;
  updateMedicalRecord: (id: string, r: Partial<MedicalRecord>, logMessage?: string) => void;
  deleteMedicalRecord: (id: string) => void;
  // Transactions
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  // Custom Statuses
  addAppointmentStatus: (status: string) => void;
  updateAppointmentStatusName: (oldStatus: string, newStatus: string) => void;
  deleteAppointmentStatus: (status: string) => void;
  // Available Slots
  addAvailableSlot: (s: Omit<AvailableSlot, 'id' | 'isBooked'>) => void;
  updateAvailableSlot: (id: string, s: Partial<AvailableSlot>) => void;
  deleteAvailableSlot: (id: string) => void;
  bookAvailableSlot: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const defaultState: AppState = {
      users: [
        { id: '1', name: 'Admin Flow', email: 'admin@fono.com', role: UserRole.ADMIN },
        { id: '2', name: 'Gerente Ana', email: 'gerente@fono.com', role: UserRole.GERENTE },
        { id: '3', name: 'Atendente Bia', email: 'atendente@fono.com', role: UserRole.ATENDENTE },
      ],
      patients: [],
      appointments: [],
      triages: [],
      records: [],
      transactions: [],
      currentUser: null,
      appointmentStatuses: [
        AppointmentStatus.A_CONFIRMAR,
        AppointmentStatus.CONFIRMADO,
        AppointmentStatus.FALTOU,
        AppointmentStatus.DESMARCADO
      ],
      availableSlots: [],
    };

    const saved = localStorage.getItem('fonoflow_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('fonoflow_data', JSON.stringify(state));
  }, [state]);

  const login = (email: string, role: UserRole) => {
    const user = state.users.find(u => u.email === email && u.role === role) || {
      id: Math.random().toString(),
      name: email?.split('@')?.[0] || 'Usuário',
      email,
      role
    };
    setState(prev => ({ ...prev, currentUser: user }));
  };

  const logout = () => setState(prev => ({ ...prev, currentUser: null }));

  // Patient CRUD
  const addPatient = (p: Omit<Patient, 'id' | 'age'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newPatient: Patient = {
      ...p,
      id,
      age: calculateAge(p.birthDate)
    };
    setState(prev => ({ ...prev, patients: [...prev.patients, newPatient] }));
    return id;
  };
  const updatePatient = (id: string, p: Partial<Patient>) => {
    setState(prev => ({
      ...prev,
      patients: prev.patients.map(item => item.id === id ? { ...item, ...p, age: p.birthDate ? calculateAge(p.birthDate) : item.age } : item)
    }));
  };
  const deletePatient = (id: string) => {
    setState(prev => ({ ...prev, patients: prev.patients.filter(item => item.id !== id) }));
  };

  // Appointment CRUD
  const addAppointment = (a: Omit<Appointment, 'id'>) => {
    const newApp: Appointment = { ...a, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => ({ ...prev, appointments: [...prev.appointments, newApp] }));
  };
  const updateAppointment = (id: string, a: Partial<Appointment>) => {
    setState(prev => ({
      ...prev,
      appointments: prev.appointments.map(item => item.id === id ? { ...item, ...a } : item)
    }));
  };
  const updateAppointmentStatus = (id: string, status: string) => {
    setState(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, status } : a)
    }));
  };
  const deleteAppointment = (id: string) => {
    setState(prev => ({ ...prev, appointments: prev.appointments.filter(item => item.id !== id) }));
  };

  // Triage CRUD
  const addTriage = (t: Omit<Triage, 'id'>) => {
    const newTriage: Triage = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => ({ ...prev, triages: [...prev.triages, newTriage] }));
  };
  const updateTriage = (id: string, t: Partial<Triage>) => {
    setState(prev => ({
      ...prev,
      triages: prev.triages.map(item => item.id === id ? { ...item, ...t } : item)
    }));
  };
  const deleteTriage = (id: string) => {
    setState(prev => ({ ...prev, triages: prev.triages.filter(item => item.id !== id) }));
  };

  // Medical Records CRUD
  const addMedicalRecord = (r: Omit<MedicalRecord, 'id' | 'createdAt' | 'history'>) => {
    const timestamp = new Date().toISOString();
    const newRecord: MedicalRecord = { 
      ...r, 
      id: Math.random().toString(36).substr(2, 9),
      createdAt: timestamp,
      history: [{
        timestamp,
        description: 'Prontuário criado.',
        user: state.currentUser?.name
      }]
    };
    setState(prev => ({ ...prev, records: [...prev.records, newRecord] }));
  };
  
  const updateMedicalRecord = (id: string, r: Partial<MedicalRecord>, logMessage?: string) => {
    const timestamp = new Date().toISOString();
    setState(prev => ({
      ...prev,
      records: prev.records.map(item => item.id === id ? { 
        ...item, 
        ...r, 
        history: [
          ...(item.history || []), 
          { 
            timestamp, 
            description: logMessage || 'Informações atualizadas.',
            user: prev.currentUser?.name 
          }
        ] 
      } : item)
    }));
  };
  
  const deleteMedicalRecord = (id: string) => {
    setState(prev => ({ ...prev, records: prev.records.filter(item => item.id !== id) }));
  };

  // Transactions CRUD
  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTrans: Transaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => ({ ...prev, transactions: [...prev.transactions, newTrans] }));
  };
  const updateTransaction = (id: string, t: Partial<Transaction>) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(item => item.id === id ? { ...item, ...t } : item)
    }));
  };
  const deleteTransaction = (id: string) => {
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(item => item.id !== id) }));
  };

  // Custom Statuses
  const addAppointmentStatus = (status: string) => {
    setState(prev => {
      if (prev.appointmentStatuses.includes(status)) return prev;
      return { ...prev, appointmentStatuses: [...prev.appointmentStatuses, status] };
    });
  };
  const updateAppointmentStatusName = (oldStatus: string, newStatus: string) => {
    setState(prev => ({
      ...prev,
      appointmentStatuses: prev.appointmentStatuses.map(s => s === oldStatus ? newStatus : s),
      appointments: prev.appointments.map(a => a.status === oldStatus ? { ...a, status: newStatus } : a)
    }));
  };
  const deleteAppointmentStatus = (status: string) => {
    setState(prev => ({
      ...prev,
      appointmentStatuses: prev.appointmentStatuses.filter(s => s !== status)
    }));
  };

  // Available Slots
  const addAvailableSlot = (s: Omit<AvailableSlot, 'id' | 'isBooked'>) => {
    const newSlot: AvailableSlot = { ...s, id: Math.random().toString(36).substr(2, 9), isBooked: false };
    setState(prev => ({ ...prev, availableSlots: [...prev.availableSlots, newSlot] }));
  };
  const updateAvailableSlot = (id: string, s: Partial<AvailableSlot>) => {
    setState(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.map(item => item.id === id ? { ...item, ...s } : item)
    }));
  };
  const deleteAvailableSlot = (id: string) => {
    setState(prev => ({ ...prev, availableSlots: prev.availableSlots.filter(item => item.id !== id) }));
  };
  const bookAvailableSlot = (id: string) => {
    setState(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.map(item => item.id === id ? { ...item, isBooked: true } : item)
    }));
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      addPatient, updatePatient, deletePatient,
      addAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus,
      addTriage, updateTriage, deleteTriage,
      addMedicalRecord, updateMedicalRecord, deleteMedicalRecord,
      addTransaction, updateTransaction, deleteTransaction,
      addAppointmentStatus, updateAppointmentStatusName, deleteAppointmentStatus,
      addAvailableSlot, updateAvailableSlot, deleteAvailableSlot, bookAvailableSlot
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
