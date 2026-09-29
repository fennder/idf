import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldAlert, 
  FileText, 
  Activity, 
  Calendar, 
  CreditCard, 
  Tv, 
  Users, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Database, 
  Stethoscope, 
  Copy, 
  Check, 
  FileCode,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Ear
} from 'lucide-react';

interface Article {
  id: string;
  category: 'clinico' | 'recepcao' | 'financeiro' | 'seguranca' | 'arquitetura' | 'painel';
  title: string;
  summary: string;
  tags: string[];
  content: React.ReactNode;
}

const KnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [expandedArticle, setExpandedArticle] = useState<string | null>('agenda-novo-paciente');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const downloadFullMarkdown = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/KNOWLEDGE_BASE.md');
    element.setAttribute('download', 'FonoFlow_Repositorio_de_Conhecimento.md');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const categories = [
    { id: 'todos', label: 'Todos os Tópicos', icon: BookOpen },
    { id: 'recepcao', label: 'Recepção & Agendamento', icon: Calendar },
    { id: 'clinico', label: 'Fonoaudiologia & Consultório', icon: Stethoscope },
    { id: 'painel', label: 'Painel TV & Autoatendimento', icon: Tv },
    { id: 'financeiro', label: 'Financeiro & Relatórios', icon: CreditCard },
    { id: 'seguranca', label: 'Auditoria & LGPD', icon: ShieldAlert },
    { id: 'arquitetura', label: 'Arquitetura & Engenharia', icon: Database },
  ];

  const articles: Article[] = [
    {
      id: 'agenda-novo-paciente',
      category: 'recepcao',
      title: 'Fluxo Ágil: Cadastro Direto pelo Agendamento & Atendimento',
      summary: 'Como cadastrar um novo paciente sem sair da agenda e registrar se o atendimento é Particular ou por Plano de Saúde.',
      tags: ['Agenda', 'Novo Paciente', 'Particular', 'Plano de Saúde', 'Recepção'],
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            O módulo de Agenda permite realizar o cadastro simultâneo de novos pacientes sem a necessidade de alternar para a tela de Pacientes, otimizando o fluxo de recepção por telefone ou presencial.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h5 className="font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" /> Passo a Passo Operacional (POP 01):
            </h5>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>Na barra lateral, clique em <strong>Agenda</strong> e depois no botão <strong>+ Novo Agendamento</strong>.</li>
              <li>No topo do modal, selecione a aba <strong>Novo Paciente</strong> (ou mantenha <em>Paciente Existente</em> caso já tenha ficha cadastrada).</li>
              <li>Preencha os campos essenciais: <em>Nome Completo, CPF, Data de Nascimento, Telefone e E-mail</em>.</li>
              <li>No campo <strong>Tipo de Atendimento</strong>, selecione:
                <ul className="list-disc list-inside pl-4 mt-1 text-slate-500">
                  <li><strong>Particular:</strong> O agendamento é faturado diretamente com a clínica.</li>
                  <li><strong>Plano de Saúde:</strong> O sistema exibirá o campo <em>Nome do Plano de Saúde</em> para preenchimento da operadora (ex: Unimed, Bradesco, Amil).</li>
                </ul>
              </li>
              <li>Escolha a <strong>Data</strong>, <strong>Horário</strong> e <strong>Sala/Consultório</strong>.</li>
              <li>Ao clicar em <strong>Salvar Agendamento</strong>, o sistema grava o novo paciente na base, calcula sua idade exata e vincula o agendamento imediatamente.</li>
            </ol>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-800 flex items-center justify-between">
            <span>💡 <strong>Dica:</strong> Nos cards da agenda, o tipo de atendimento é exibido com identificação visual destacada para agilizar a triagem diária.</span>
          </div>
        </div>
      )
    },
    {
      id: 'protocolos-fonoaudiologia',
      category: 'clinico',
      title: 'Protocolos de Exames Clínicos: Orelhinha, Linguinha e Audiometria',
      summary: 'Diretrizes clínicas para os testes fonoaudiológicos aplicados no módulo Consultório e emissão de laudo em PDF.',
      tags: ['Consultório', 'Teste da Orelhinha', 'Teste da Linguinha', 'Audiometria', 'Laudo PDF'],
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            O módulo <strong>Consultório</strong> concentra as avaliações audiológicas e miofuncionais orofaciais frequentes na rotina da clínica, com suporte a laudos padronizados:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-slate-200 rounded-xl p-3 bg-white">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 mb-2">Neonatal</span>
              <h6 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                <Ear size={16} className="text-amber-600" /> Teste da Orelhinha
              </h6>
              <p className="text-xs text-slate-600">
                Triagem Auditiva Neonatal via Emissões Otoacústicas Evocadas (EOAE). Avalia respostas cocleares em OD e OE para detecção precoce de perdas auditivas congênitas.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-3 bg-white">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-pink-100 text-pink-800 mb-2">Protocolo Martinelli</span>
              <h6 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                <Activity size={16} className="text-pink-600" /> Teste da Linguinha
              </h6>
              <p className="text-xs text-slate-600">
                Avaliação anatômica e funcional do frênulo da língua em bebês para diagnóstico de anquiloglossia e orientação sobre frenotomia lingual.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-3 bg-white">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 mb-2">Audiologia</span>
              <h6 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                <Stethoscope size={16} className="text-blue-600" /> Audiometria
              </h6>
              <p className="text-xs text-slate-600">
                Audiometria Tonal Liminar e Logoaudiometria para quantificação e qualificação das perdas auditivas em crianças e adultos.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-medium">Os laudos podem ser gerados em formato PDF oficial com carimbo virtual e número de registro no CRFa.</span>
          </div>
        </div>
      )
    },
    {
      id: 'triagem-acolhimento',
      category: 'clinico',
      title: 'Triagem Fonoaudiológica & Automação de Prontuário',
      summary: 'Regras de decisão (Passa, Encaminha, Falha) e a criação automática do prontuário para reduzir redundância.',
      tags: ['Triagem', 'Passa', 'Encaminha', 'Falha', 'Prontuário'],
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            A fase de acolhimento e triagem classifica os pacientes confirmados da agenda e estabelece a linha de base para o atendimento especializado.
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">P</div>
              <div>
                <strong className="text-emerald-900 text-sm">Passa:</strong>
                <p className="text-xs text-emerald-800">Desenvolvimento fonoaudiológico dentro dos marcos esperados para a faixa etária. Não requer encaminhamento imediato.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">E</div>
              <div>
                <strong className="text-amber-900 text-sm">Encaminha:</strong>
                <p className="text-xs text-amber-800">Dúvida diagnóstica, necessidade de reteste em 30 dias ou encaminhamento para otorrinolaringologista, neuropediatra ou ortodontista.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">F</div>
              <div>
                <strong className="text-rose-900 text-sm">Falha:</strong>
                <p className="text-xs text-rose-800">Alteração significativa identificada. O paciente é prioritário para agendamento de plano terapêutico contínuo.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-700">
            ⚡ <strong>Automação de Prontuário:</strong> Ao finalizar a triagem, o FonoFlow inicia de forma transparente o registro em <em>Prontuários</em> (Fase 4), transferindo queixa principal, responsáveis e exames solicitados.
          </div>
        </div>
      )
    },
    {
      id: 'painel-publico-autoagendamento',
      category: 'painel',
      title: 'Painel TV para Sala de Espera e Portal de Autoagendamento',
      summary: 'Configuração da tela de TV na sala de espera com sintetizador de áudio e link externo de agendamento.',
      tags: ['Painel', 'TV', 'Autoagendamento', 'Chamada por Voz', 'Sala de Espera'],
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            O FonoFlow disponibiliza duas rotas públicas com propósitos dedicados que funcionam de maneira autônoma:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-indigo-400 flex items-center gap-1.5"><Tv size={16} /> Painel de TV (/painel)</span>
                <span className="text-xs bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded">Recepção</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Projetado para telas em monitores na sala de espera. Exibe os horários do dia, relógio de alta precisão e botão de chamada sonora com áudio sintetizado para convocar o paciente ao consultório.
              </p>
              <div className="text-xs text-slate-400 bg-slate-800/80 p-2 rounded">
                🔒 <strong>Privacidade LGPD:</strong> O sobrenome dos pacientes é automaticamente abreviado/mascarado no painel público para proteção de identidade.
              </div>
            </div>

            <div className="p-4 bg-emerald-950 text-white rounded-xl border border-emerald-900">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5"><Calendar size={16} /> Autoagendamento (/agendamento-paciente)</span>
                <span className="text-xs bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded">Portal</span>
              </div>
              <p className="text-xs text-emerald-200 mb-3">
                Link compartilhável em redes sociais ou WhatsApp da clínica para o próprio paciente escolher horários livres pré-configurados pela equipe.
              </p>
              <div className="text-xs text-emerald-300 bg-emerald-900/40 p-2 rounded">
                ✅ O paciente seleciona Particular ou Convênio e já cai na agenda da recepção com status <em>"A Confirmar"</em>.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'auditoria-vulnerabilidades-lgpd',
      category: 'seguranca',
      title: 'Relatório de Auditoria de Segurança, Vulnerabilidades e LGPD',
      summary: 'Diagnóstico técnico da versão atual, riscos de conformidade em saúde e plano de mitigação para ambiente produtivo.',
      tags: ['Auditoria', 'Segurança', 'LGPD', 'LocalStorage', 'Firebase', 'CFFa'],
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
            <h5 className="font-bold text-rose-900 flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-600" /> Pontos Críticos Diagnosticados na Auditoria:
            </h5>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-rose-800">
              <li><strong>Armazenamento em LocalStorage:</strong> Prontuários, nomes e dados de contato residem no navegador sem criptografia em repouso. Se o dispositivo for compartilhado ou violado por scripts maliciosos, os dados podem ser expostos.</li>
              <li><strong>Controle de Acesso Exclusivamente no Frontend:</strong> O RBAC (Admin, Gerente, Atendente) é validado pelo React. Sem regras no servidor (Security Rules), qualquer usuário com console de desenvolvedor poderia manipular o estado.</li>
              <li><strong>Geração de IDs Previsíveis:</strong> Identificadores gerados com <code>Math.random()</code> são suscetíveis a colisões e previsibilidade.</li>
              <li><strong>Conformidade LGPD (Art. 5º e 11º):</strong> Dados de saúde exigem controle estrito de finalidade, registro de consentimento e logs auditáveis de acesso aos prontuários.</li>
            </ul>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <h5 className="font-bold text-indigo-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-600" /> Soluções Recomendadas & Plano de Mitigação:
            </h5>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-indigo-800">
              <li>Migrar para <strong>Firebase Firestore</strong> ou <strong>Cloud SQL (PostgreSQL)</strong> com autenticação real (Firebase Auth / tokens JWT).</li>
              <li>Implantar <strong>Security Rules</strong> no banco para que apenas profissionais autorizados consigam ler e gravar prontuários.</li>
              <li>Adotar <code>crypto.randomUUID()</code> em substituição ao <code>Math.random()</code>.</li>
              <li>Manter e expandir a trilha de auditoria já existente (campo <code>history</code> nos prontuários clínicos).</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'financeiro-relatorios',
      category: 'financeiro',
      title: 'Fluxo Financeiro, Métodos de Pagamento e Exportação Contábil',
      summary: 'Regras de lançamento de contas a pagar e receber, alertas de vencimento em 7 dias e geração de relatórios em CSV.',
      tags: ['Financeiro', 'PIX', 'Boleto', 'CSV', 'Contas a Pagar', 'Contas a Receber'],
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            O módulo Financeiro atua como o livro-caixa digital da clínica, permitindo o acompanhamento de receitas de atendimentos e despesas operacionais (aluguel, materiais, energia).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-600 font-semibold uppercase">Saldo Recebido</span>
              <p className="text-emerald-800 font-bold text-lg mt-1">Entradas Efetivadas</p>
              <p className="text-[11px] text-slate-500 mt-1">Pagamentos liquidados via PIX, Débito, Crédito ou Dinheiro.</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-xs text-amber-600 font-semibold uppercase">A Receber</span>
              <p className="text-amber-800 font-bold text-lg mt-1">Previsão Futura</p>
              <p className="text-[11px] text-slate-500 mt-1">Consultas pendentes de liquidação e faturas de convênios.</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-xs text-rose-600 font-semibold uppercase">A Pagar</span>
              <p className="text-rose-800 font-bold text-lg mt-1">Saídas da Clínica</p>
              <p className="text-[11px] text-slate-500 mt-1">Contas operacionais, insumos descartáveis e honorários.</p>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-800">Exportação em CSV para Contabilidade:</p>
              <p className="text-slate-500">Na aba <em>Relatórios</em>, o botão CSV gera o extrato completo com data, descrição, tipo, valor e método de pagamento.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'arquitetura-modelagem-dados',
      category: 'arquitetura',
      title: 'Estruturas de Dados TypeScript & Arquitetura do Sistema',
      summary: 'Dicionário dos modelos centrais (Patient, Appointment, Triage, MedicalRecord, Transaction) e ciclo de vida do estado.',
      tags: ['TypeScript', 'Modelos', 'Entidades', 'AppContext', 'Arquitetura'],
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Abaixo estão os esquemas canônicos declarados em <code>types.ts</code> que estruturam a integridade dos dados no <code>AppContext</code>:
          </p>
          <div className="space-y-3">
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-xs overflow-x-auto relative">
              <button 
                onClick={() => copyToClipboard(`export interface Patient {
  id: string;
  fullName: string;
  birthDate: string;
  age: number;
  phone: string;
  email: string;
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
}`, 'code-snippet-1')}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1"
                title="Copiar Código"
              >
                {copiedId === 'code-snippet-1' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedId === 'code-snippet-1' ? 'Copiado' : 'Copiar'}</span>
              </button>
              <pre className="text-slate-300">
{`// Entidades Principais
export interface Patient {
  id: string;
  fullName: string;
  birthDate: string;
  age: number;
  phone: string;
  email: string;
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
}`}
              </pre>
            </div>

            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-xs overflow-x-auto relative">
              <button 
                onClick={() => copyToClipboard(`export interface MedicalRecord {
  id: string;
  appointmentId: string;
  type: RecordType;
  details: any;
  createdAt: string;
  history: RecordHistory[];
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
}`, 'code-snippet-2')}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1"
                title="Copiar Código"
              >
                {copiedId === 'code-snippet-2' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedId === 'code-snippet-2' ? 'Copiado' : 'Copiar'}</span>
              </button>
              <pre className="text-slate-300">
{`// Prontuário com Trilha de Auditoria & Transações
export interface MedicalRecord {
  id: string;
  appointmentId: string;
  type: RecordType;
  details: any;
  createdAt: string;
  history: RecordHistory[]; // Auditoria CFFa
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
}`}
              </pre>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'todos' || article.category === selectedCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border border-indigo-400/30">
            <Sparkles size={14} className="text-amber-300" />
            <span>Repositório Oficial de Conhecimento FonoFlow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Base de Conhecimento da Aplicação
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6">
            Guia completo de procedimentos operacionais padrão (POPs), regras de negócio clínicas, fluxos de recepção, mapeamento de auditoria de segurança e modelagem arquitetural da clínica.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={downloadFullMarkdown}
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download size={16} /> Baixar KNOWLEDGE_BASE.md
            </button>
            <a
              href="#protocolos-fonoaudiologia"
              onClick={() => {
                setSelectedCategory('clinico');
                setExpandedArticle('protocolos-fonoaudiologia');
              }}
              className="bg-indigo-500/40 hover:bg-indigo-500/60 border border-indigo-400/30 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              Consultar Protocolos Clínicos
            </a>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquise por módulo, protocolo (Orelhinha, Linguinha), agendamento, LGPD, convênio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles List / Knowledge Accordions */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => {
            const isExpanded = expandedArticle === article.id;
            return (
              <div
                key={article.id}
                id={article.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:border-slate-300"
              >
                <div
                  onClick={() => setExpandedArticle(isExpanded ? null : article.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none bg-white hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {categories.find(c => c.id === article.category)?.label}
                      </span>
                      {article.tags.map(tag => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      {article.summary}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 self-center">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/40">
                    {article.content}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
            <HelpCircle size={40} className="mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700">Nenhum tópico correspondente encontrado</p>
            <p className="text-xs text-slate-400">Tente buscar por outros termos como "agenda", "plano", "orelhinha" ou "auditoria".</p>
          </div>
        )}
      </div>

      {/* Quick Reference Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <FileCode size={20} />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Arquivo KNOWLEDGE_BASE.md</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Documento mestre em Markdown estruturado na raiz da aplicação com a totalidade dos fluxos técnicos, tabelas comparativas e matriz de permissões.
          </p>
          <button
            onClick={downloadFullMarkdown}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} /> Obter Cópia do Arquivo
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">POP de Recepção (01)</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instrução de trabalho para cadastro instantâneo de novos pacientes na grade de agendamentos com separação clara entre particular e convênio.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('recepcao');
              setExpandedArticle('agenda-novo-paciente');
            }}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
          >
            Ver Procedimento <ExternalLink size={14} />
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <ShieldAlert size={20} />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Auditoria e Próximos Passos</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Orientações de transição do LocalStorage para infraestrutura em nuvem (Firebase Firestore / Cloud SQL) para garantir conformidade integral à LGPD.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('seguranca');
              setExpandedArticle('auditoria-vulnerabilidades-lgpd');
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 cursor-pointer"
          >
            Ver Detalhes da Auditoria <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
