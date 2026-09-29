# FonoFlow — Repositório de Conhecimento do Sistema

> **Versão da Aplicação:** 1.2.0  
> **Última Atualização:** Setembro/2026  
> **Finalidade:** Documentação unificada de arquitetura, fluxos operacionais, regras de negócio, modelagem de dados, matriz de permissões e auditoria de segurança da plataforma **FonoFlow - Gestão de Clínica Fonoaudiológica**.

---

## Sumário
1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Arquitetura Tecnológica](#2-arquitetura-tecnológica)
3. [Matriz de Acesso e Perfis (RBAC)](#3-matriz-de-acesso-e-perfis-rbac)
4. [Mapeamento Completo de Módulos e Funcionalidades](#4-mapeamento-completo-de-módulos-e-funcionalidades)
   - 4.1. Dashboard Geral
   - 4.2. Agenda e Gestão de Horários
   - 4.3. Cadastro Integrado de Pacientes e Atendimento
   - 4.4. Triagem Fonoaudiológica e Acolhimento
   - 4.5. Prontuários Eletrônicos e Histórico de Alterações
   - 4.6. Consultório Clínico e Exames Específicos
   - 4.7. Gestão Financeira e Fluxo de Caixa
   - 4.8. Relatórios Gerenciais e Exportação
   - 4.9. Pós-Atendimento e Retenção
   - 4.10. Portal de Autoagendamento Público
   - 4.11. Painel de Chamada para Sala de Espera
5. [Modelagem e Dicionário de Dados](#5-modelagem-e-dicionário-de-dados)
6. [Auditoria de Segurança, Vulnerabilidades e LGPD](#6-auditoria-de-segurança-vulnerabilidades-e-lgpd)
7. [Procedimentos Operacionais Padrão (POPs)](#7-procedimentos-operacionais-padrão-pops)
8. [Plano de Evolução e Roadmap de Infraestrutura](#8-plano-de-evolução-e-roadmap-de-infraestrutura)

---

## 1. Visão Geral do Produto

O **FonoFlow** é uma plataforma clínica e administrativa especializada nas necessidades cotidianas de consultórios e clínicas de **Fonoaudiologia**. O software abrange todo o ciclo de vida do paciente fonoaudiológico:
- **Atração e Agendamento:** Vagas públicas de autoagendamento ou agendamento direto na recepção;
- **Recepção e Sala de Espera:** Painel público em TV com chamada em áudio/visual de pacientes;
- **Acolhimento e Triagem:** Triagem fonoaudiológica com regras de "Passa", "Encaminha" ou "Falha";
- **Atendimento Clínico Especializado:** Fichas clínicas para Teste da Orelhinha (Emissões Otoacústicas), Teste da Linguinha (Frenotomia/Anquiloglossia), Audiometria e emissão de laudo em PDF;
- **Prontuário com Trilha de Auditoria:** Rastreamento de modificações para conformidade regulatória;
- **Financeiro & Contas:** Controle de entradas/saídas, métodos (PIX, cartões, boleto), cobrança e emissão de recibos;
- **Pós-Atendimento:** Acompanhamento de retorno e lembretes automáticos para elevar fidelização.

---

## 2. Arquitetura Tecnológica

### 2.1 Stack Frontend
- **Framework:** React 18+ com TypeScript
- **Bundler & Dev Server:** Vite
- **Estilização:** Tailwind CSS (sistema utilitário ágil e responsivo)
- **Biblioteca de Ícones:** `lucide-react`
- **Geração de Documentos:** `jspdf` (renderização e download de laudos clínicos no client-side)

### 2.2 Gerenciamento de Estado e Persistência
- **Padrão:** Context API com React Hook `useContext` (`AppContext.tsx`).
- **Persistência Atual:** `localStorage` sob a chave `fonoflow_data`, serializada automaticamente via `useEffect`.
- **Rotas Especiais:**
  - `/` (ou tabs internas): Aplicação autenticada com navegação via `Layout`.
  - `/agendamento-paciente`: Página pública e limpa para pacientes reservarem vagas.
  - `/painel`: Interface de TV / display para sala de espera com relógio sincronizado e chamadas sonoras.

---

## 3. Matriz de Acesso e Perfis (RBAC)

O sistema conta com 4 perfis de usuários bem definidos (`UserRole`):

| Módulo / Recurso | Administrador (`ADMIN`) | Gerente (`GERENTE`) | Atendente (`ATENDENTE`) | Paciente (`PACIENTE`) |
| :--- | :---: | :---: | :---: | :---: |
| **Dashboard** | Total | Total | Operacional | Restrito ao próprio |
| **Agenda Clínica** | Leitura/Escrita | Leitura/Escrita | Leitura/Escrita | Somente Visualização |
| **Pacientes** | Completo | Completo | Completo | Inacessível |
| **Triagem** | Completo | Completo | Completo | Inacessível |
| **Prontuários** | Completo | Completo | Completo | Inacessível |
| **Consultório Clínico** | Completo | Completo | Completo | Inacessível |
| **Financeiro** | Total | Total | Oculto | Inacessível |
| **Relatórios** | Total | Total | Oculto | Inacessível |
| **Pós-Atendimento** | Total | Inacessível | Operacional | Inacessível |
| **Configuração de Status** | Sim | Sim | Não | Não |
| **Vagas Públicas (Slots)** | Gerenciar | Gerenciar | Gerenciar | Visualizar/Reservar |

---

## 4. Mapeamento Completo de Módulos e Funcionalidades

### 4.1. Dashboard Geral (`/pages/Dashboard.tsx`)
- Apresenta os principais indicadores operacionais em tempo real:
  - Total de atendimentos do dia;
  - Taxa de comparecimento e absenteísmo;
  - Resumo financeiro rápido do mês;
  - Lista de próximos pacientes com acesso a ações rápidas.

### 4.2. Agenda e Gestão de Horários (`/pages/Agenda.tsx`)
- Grade e listagem de agendamentos com filtros por data e status;
- Configuração de status dinâmicos (modal `AgendaSettingsModal.tsx`);
- Gestão de Vagas Disponíveis (modal `AvailableSlotsModal.tsx`) para alimentar a grade de autoagendamento;
- Exibição destacada do **Tipo de Atendimento** (Particular vs Plano de Saúde) em cada card;
- Disparo de notificações de agendamentos próximos via `NotificationManager.tsx`.

### 4.3. Cadastro Integrado de Pacientes e Atendimento
- **Fluxo Ágil na Agenda:** Possibilidade de selecionar entre "Paciente Existente" ou "Novo Paciente" diretamente no modal de agendamento sem perder o contexto do agendamento;
- **Seleção de Tipo de Atendimento:**
  - **Particular:** Define cobrança direta e integração com a aba Financeira;
  - **Plano de Saúde:** Abre campo condicional para registrar a operadora de saúde (ex: Unimed, Bradesco Saúde, Amil, SulAmérica).
- **Módulo de Pacientes (`/pages/Patients.tsx`):**
  - Cadastro detalhado: Nome completo, CPF, Data de Nascimento, Telefone, E-mail;
  - Cálculo automático de idade precisa em anos (`calculateAge`);
  - Busca rápida em tempo real por nome, CPF ou contato;
  - Histórico de consultas vinculadas ao cadastro.

### 4.4. Triagem Fonoaudiológica (`/pages/Triage.tsx`)
- Acolhimento do paciente com registro de queixa principal, profissão, histórico familiar (nome da mãe e pai) e exames solicitados;
- Definição do resultado da triagem:
  - **Passa:** Desenvolvimento compatível com os marcos esperados;
  - **Encaminha:** Necessidade de intervenção especializada ou exames complementares;
  - **Falha:** Alteração detectada que exige diagnóstico e tratamento imediato;
- **Automação Inteligente:** Ao salvar a triagem, o FonoFlow inicia automaticamente o Prontuário Clínico (Fase 4), transferindo os dados sem retrabalho para o fonoaudiólogo.

### 4.5. Prontuários Eletrônicos (`/pages/Records.tsx`)
- Tipos de prontuário suportados:
  - `Consulta/Avaliação`
  - `Retorno`
  - `Exame`
  - `Sessão Terapêutica`
- **Trilha de Auditoria e Versionamento:** Todas as alterações no prontuário gravam um registro em `history` com timestamp, usuário responsável e descrição da alteração, garantindo conformidade com a regulamentação do Conselho Federal de Fonoaudiologia (CFFa);
- Emissão de espelho de prontuário e laudo descritivo.

### 4.6. Consultório Clínico (`/pages/Clinic.tsx`)
- Interface de ponto de atendimento para o Fonoaudiólogo no momento da consulta;
- Permite selecionar o paciente confirmado do dia;
- Formulários específicos da especialidade:
  - **Teste da Orelhinha:** Registro de Emissões Otoacústicas Evocadas (EOAE), orelha direita e esquerda, presença ou ausência de respostas cocleares;
  - **Teste da Linguinha:** Avaliação do frênulo lingual de acordo com o Protocolo de Martinelli (avaliação anatômica e funcional na sucção/deglutição);
  - **Audiometria:** Registro de limiares tonais, logoaudiometria e parecer audiológico;
- Geração de Laudo Clínico em PDF profissional com data, parecer e campo para carimbo e CRFa;
- Simulação de envio imediato por e-mail para o paciente ou médico solicitante.

### 4.7. Gestão Financeira (`/pages/Finance.tsx`)
- Lançamento de despesas e receitas associadas a consultas ou custos operacionais;
- Métodos de pagamento aceitos: PIX, Dinheiro, Débito, Crédito, Transferência, Boleto;
- Totais consolidados de:
  - Saldo Recebido;
  - Contas a Receber (previsão futura e inadimplência);
  - Contas a Pagar (despesas da clínica);
- Alertas visuais para vencimentos nos próximos 7 dias no cabeçalho;
- Envio de lembrete de pagamento via mensagem.

### 4.8. Relatórios Gerenciais (`/pages/Reports.tsx`)
- Análise de faturamento e volume de atendimentos em períodos mensais e anuais;
- Exportação dos dados financeiros em formato **CSV** para conciliação em planilhas ou ERP contábil;
- Relatório consolidado para fechamento gerencial.

### 4.9. Pós-Atendimento e Fidelização (`/pages/PostCare.tsx`)
- Listagem dos pacientes que concluíram sessão para acompanhamento da evolução clínica;
- Disparo simulado de mensagens de retorno via WhatsApp e E-mail com templates humanizados;
- Métricas de taxa de reatendimento / fidelidade.

### 4.10. Portal de Autoagendamento Público (`/pages/ExternalScheduling.tsx`)
- Rota autônoma acessível por link externo: `/agendamento-paciente`;
- O paciente visualiza horários e profissionais disponíveis configurados pela clínica;
- Coleta de dados com prevenção de duplicidade (reaproveita cadastro se o e-mail ou telefone já existirem);
- Opção para o próprio paciente informar se o atendimento é Particular ou por Convênio com o nome da operadora;
- Confirmação com status "A Confirmar" para triagem da recepção.

### 4.11. Painel de TV para Sala de Espera (`/pages/PublicPanel.tsx`)
- Rota `/painel` desenhada especificamente para monitores e TVs em salas de espera;
- Interface dark mode de alto contraste com relógio em tempo real;
- Exibição dos atendimentos do dia com mascaramento do sobrenome dos pacientes para proteção de privacidade (LGPD);
- Recurso de chamada sonora com áudio sintetizado para chamar o paciente ao consultório.

---

## 5. Modelagem e Dicionário de Dados

### 5.1 Entidades Principais (`types.ts`)

#### `Patient` (Paciente)
```typescript
interface Patient {
  id: string;
  fullName: string;
  birthDate: string; // Formato YYYY-MM-DD
  age: number;       // Calculado automaticamente
  phone: string;
  email: string;
}
```

#### `Appointment` (Agendamento)
```typescript
interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  location: string;
  status: string;
  attendanceType?: 'Particular' | 'Plano de Saúde';
  healthInsurance?: string; // Nome do convênio quando aplicável
}
```

#### `Triage` (Triagem Fonoaudiológica)
```typescript
interface Triage {
  id: string;
  appointmentId: string;
  date: string;
  time: string;
  location: string;
  status: TriageStatus; // 'Passa' | 'Encaminha' | 'Falha'
}
```

#### `MedicalRecord` (Prontuário)
```typescript
interface MedicalRecord {
  id: string;
  appointmentId: string;
  type: RecordType; // 'Consulta/Avaliação' | 'Retorno' | 'Exame' | 'Sessão'
  details: any;
  createdAt: string;
  history: RecordHistory[]; // Trilha de auditoria
}
```

#### `Transaction` (Transação Financeira)
```typescript
interface Transaction {
  id: string;
  appointmentId: string;
  patientId: string;
  type: 'PAGAR' | 'RECEBER' | 'RECEBIDO' | 'PAGO';
  description: string;
  value: number;
  method?: PaymentMethod; // 'Dinheiro' | 'PIX' | 'Transferência' | 'Débito' | 'Crédito' | 'Boleto'
  date: string;
}
```

#### `AvailableSlot` (Vaga Aberta de Autoagendamento)
```typescript
interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  location: string;
  professional: string;
  isBooked: boolean;
}
```

---

## 6. Auditoria de Segurança, Vulnerabilidades e LGPD

Conforme a auditoria técnica realizada no sistema, destacam-se os seguintes pontos de atenção essenciais para a evolução da versão atual (SPA em navegador):

### 6.1 Vulnerabilidades Identificadas
1. **Armazenamento em `localStorage`:**
   - *Risco:* Os dados de saúde (anamnese, prontuários, nomes e contatos) estão salvos no armazenamento local do navegador em texto puro, sem criptografia em repouso. Qualquer script de terceiros ou extensão com acesso ao DOM pode ler a chave `fonoflow_data`.
   - *Solução:* Migração para banco de dados relacional em nuvem ou Firestore com regras de segurança no servidor.
2. **Autenticação Simulada (Client-side):**
   - *Risco:* A troca de usuário no seletor de login é puramente ilustrativa no estado do React; não há verificação criptográfica de token JWT nem senhas com hash seguro (`bcrypt`/`argon2`).
   - *Solução:* Implementar Firebase Authentication ou Auth0 com RBAC validado via backend.
3. **Geração de IDs via `Math.random()`:**
   - *Risco:* `Math.random()` não é criptograficamente seguro (`CSPRNG`), tornando os identificadores previsíveis.
   - *Solução:* Utilizar `crypto.randomUUID()` nativo do navegador ou UUIDv4.
4. **Regras de Acesso aplicadas apenas no Frontend:**
   - *Risco:* Um usuário com perfil `ATENDENTE` ou `PACIENTE` com conhecimentos básicos de JavaScript pode inspecionar o console e manipular o estado do Context para visualizar registros de outros pacientes ou faturamentos.
   - *Solução:* O backend deve ser a autoridade suprema na concessão de dados sensíveis.

### 6.2 Conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)
- **Dados Sensíveis (Art. 5º, II):** Informações de saúde e prontuários fonoaudiológicos são classificados como dados pessoais sensíveis;
- **Consentimento e Registro de Acessos:** Exigência de termo de consentimento no autoagendamento e registro formal de quem acessou/modificou cada prontuário (já iniciado pelo array `history` nos registros);
- **Privacidade por Padrão no Painel Público:** O módulo `/painel` cumpre a diretriz de privacidade ao ocultar os sobrenomes dos pacientes expostos na TV da sala de espera.

---

## 7. Procedimentos Operacionais Padrão (POPs)

### POP 01: Atendimento Telefônico ou Presencial na Recepção
1. Acessar a aba **Agenda**;
2. Clicar em **Novo Agendamento**;
3. Se o paciente já for cadastrado, manter selecionado **"Paciente Existente"** e digitar o nome na busca;
4. Se for primeiro atendimento, selecionar **"Novo Paciente"**, preencher nome, CPF, telefone, data de nascimento e e-mail;
5. Escolher a data, horário e sala;
6. Definir se o atendimento será **Particular** ou **Plano de Saúde**. Em caso de convênio, registrar o nome do plano;
7. Salvar. O paciente e o agendamento serão gravados simultaneamente.

### POP 02: Acolhimento e Triagem
1. Acessar a aba **Triagem**;
2. Selecionar o agendamento confirmado na lista de espera;
3. Preencher queixa principal, dados complementares e o parecer da triagem (**Passa**, **Encaminha** ou **Falha**);
4. Ao clicar em salvar, o sistema abre automaticamente a base do prontuário para o atendimento clínico.

### POP 03: Consulta e Emissão de Laudos no Consultório
1. Na aba **Consultório**, selecionar o paciente em atendimento na lista do dia;
2. Registrar observações clínicas, queixa e selecionar os testes fonoaudiológicos realizados:
   - Para bebês: preencher os campos do **Teste da Orelhinha** e **Teste da Linguinha**;
   - Para exames auditivos: registrar os dados da **Audiometria**;
3. Clicar em **"Salvar Registro Clínico"** para registrar na base com carimbo de data/hora;
4. Clicar em **"Baixar Laudo em PDF"** para imprimir ou enviar eletronicamente ao paciente ou pediatra.

### POP 04: Fechamento de Caixa Diário
1. O Administrador ou Gerente acessa a aba **Financeiro**;
2. Confere os valores **Recebidos**, **A Receber** e **A Pagar**;
3. Filtra transações por método (PIX, Cartão, Dinheiro) e valida com o extrato bancário ou maquininha;
4. Na aba **Relatórios**, gera o arquivo CSV do período para consolidação.

---

## 8. Plano de Evolução e Roadmap de Infraestrutura

- **Fase 1 (Atual):** SPA completa em React + TypeScript com todos os fluxos clínicos e administrativos integrados via LocalStorage;
- **Fase 2 (Próxima):** Conexão com Firebase Firestore (banco NoSQL distribuído) e Firebase Authentication com regras de segurança ativas (`firestore.rules`);
- **Fase 3:** Integração oficial com API do WhatsApp (Meta Business API) para notificações automáticas de confirmação de consultas e lembretes de pós-atendimento;
- **Fase 4:** Assinatura digital padrão ICP-Brasil para os laudos e prontuários fonoaudiológicos gerados pelo sistema.
