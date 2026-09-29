
export enum UserRole {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  ATENDENTE = 'ATENDENTE',
  PACIENTE = 'PACIENTE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface Patient {
  id: string;
  fullName: string;
  birthDate: string;
  age: number;
  phone: string;
  email: string;
}

export enum AppointmentStatus {
  A_CONFIRMAR = 'A Confirmar',
  CONFIRMADO = 'Confirmado',
  FALTOU = 'Faltou',
  DESMARCADO = 'Desmarcado'
}

export interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  location: string;
  professional: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  location: string;
  status: string;
  attendanceType?: 'Particular' | 'Plano de Saúde';
  healthInsurance?: string;
}

export enum TriageStatus {
  PASSA = 'Passa',
  ENCAMINHA = 'Encaminha',
  FALHA = 'Falha'
}

export interface Triage {
  id: string;
  appointmentId: string;
  date: string;
  time: string;
  location: string;
  status: TriageStatus;
}

export enum RecordType {
  CONSULTA_AVALIACAO = 'Consulta/Avaliação',
  RETORNO = 'Retorno',
  EXAME = 'Exame',
  SESSAO = 'Sessão'
}

export interface RecordHistory {
  timestamp: string;
  description: string;
  user?: string;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  type: RecordType;
  details: any;
  createdAt: string;
  history: RecordHistory[];
}

export enum PaymentMethod {
  DINHEIRO = 'Dinheiro',
  PIX = 'PIX',
  TRANSFERENCIA = 'Transferência',
  DEBITO = 'Débito',
  CREDITO = 'Crédito',
  BOLETO = 'Boleto',
  OUTRO = 'Outro'
}

export interface Transaction {
  id: string;
  appointmentId: string;
  patientId: string;
  type: 'PAGAR' | 'RECEBER' | 'RECEBIDO' | 'PAGO';
  description: string;
  value: number;
  method?: PaymentMethod;
  date: string;
}

export interface AppState {
  users: User[];
  patients: Patient[];
  appointments: Appointment[];
  triages: Triage[];
  records: MedicalRecord[];
  transactions: Transaction[];
  currentUser: User | null;
  appointmentStatuses: string[];
  availableSlots: AvailableSlot[];
}
