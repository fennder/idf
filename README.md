# FonoFlow — Gestão de Clínica Fonoaudiológica

> **FonoFlow** é uma solução completa e moderna para o gerenciamento operacional, clínico e financeiro de consultórios e clínicas de **Fonoaudiologia**.

---

## 📌 Sumário
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Rotas Especiais](#-rotas-especiais)
- [Perfis de Acesso (RBAC)](#-perfis-de-acesso-rbac)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura de Diretórios](#-estrutura-de-diretórios)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Repositório de Conhecimento e Documentação](#-repositório-de-conhecimento-e-documentação)

---

## 💡 Sobre o Projeto

O **FonoFlow** foi concebido para eliminar o atrito entre a recepção e o consultório fonoaudiológico. Ele integra todo o percurso do paciente:
1. **Autoagendamento e Recepção:** Entrada ágil com distinção clara entre atendimento particular e convênio.
2. **Sala de Espera:** Painel em TV com chamada auditiva e visual respeitando a privacidade (LGPD).
3. **Acolhimento & Triagem:** Classificação rápida de risco (Passa, Encaminha ou Falha) com automação direta para o prontuário.
4. **Atendimento Especializado:** Fichas clínicas para testes específicos da fonoaudiologia (Teste da Orelhinha, Teste da Linguinha e Audiometria) com geração de laudos em PDF.
5. **Gestão e Pós-Atendimento:** Fluxo de caixa com alertas de vencimento, exportação CSV e acompanhamento pós-consulta.

---

## 🚀 Funcionalidades Principais

### 1. 📅 Agenda & Gestão de Horários
- Grade diária e semanal de atendimentos.
- **Cadastro Direto pelo Agendamento:** Permite cadastrar um novo paciente no mesmo instante em que se agenda a consulta, sem troca de tela.
- **Tipo de Atendimento:** Escolha entre **Particular** e **Plano de Saúde** (com campo dinâmico para registrar o nome da operadora/convênio).
- **Vagas Disponíveis:** Gestão de horários abertos para alimentar o portal público de autoagendamento.

### 2. 👥 Gestão de Pacientes
- Cadastro completo de dados demográficos e contatos.
- Cálculo automático de idade exata a partir da data de nascimento.
- Histórico integrado de consultas e sessões fonoaudiológicas.

### 3. 🩺 Triagem Fonoaudiológica
- Registro de queixa principal, filiação e exames solicitados.
- Parecer estruturado: **Passa**, **Encaminha** ou **Falha**.
- **Automação Inteligente:** Ao salvar a triagem, o prontuário clínico é iniciado automaticamente, transferindo os dados sem retrabalho.

### 4. 🔬 Consultório Clínico & Exames Especializados
- Ponto de atendimento para o fonoaudiólogo durante a consulta.
- Fichas padronizadas para:
  - **Teste da Orelhinha (EOAE):** Triagem Auditiva Neonatal para orelha direita e esquerda.
  - **Teste da Linguinha (Protocolo Martinelli):** Avaliação anatômica e funcional de frênulo lingual.
  - **Audiometria:** Registro de limiares tonais, logoaudiometria e parecer audiológico.
- **Geração de Laudo em PDF:** Emissão de documento formatado com parecer clínico e campo para assinatura/CRFa.

### 5. 📋 Prontuários Eletrônicos & Trilha de Auditoria
- Registro de consultas, sessões terapêuticas, retornos e exames.
- Histórico auditável (`history`) registrando usuário responsável, data e alteração realizada (conformidade CFFa).

### 6. 💳 Módulo Financeiro
- Livro-caixa com status **Recebido**, **A Receber** e **A Pagar**.
- Suporte a múltiplos métodos de pagamento: **PIX**, **Dinheiro**, **Débito**, **Crédito**, **Boleto** e **Transferência**.
- Alertas automáticos no cabeçalho para contas com vencimento nos próximos 7 dias.

### 7. 📊 Relatórios & Fechamento
- Visão consolidada mensal e anual.
- Exportação instantânea dos lançamentos em formato **CSV** para conciliação contábil.

### 8. 💬 Pós-Atendimento & Retenção
- Painel com pacientes atendidos para acompanhamento pós-sessão.
- Disparo de mensagens humanizadas de acompanhamento via WhatsApp ou E-mail.

### 9. 📚 Base de Conhecimento Integrada
- Repositório interno com busca rápida de artigos operacionais, POPs da recepção, diretrizes clínicas e notas de auditoria de segurança.

---

## 🖥️ Rotas Especiais

| Rota | Descrição |
| :--- | :--- |
| `/` | Interface principal do sistema com menu lateral e controle de acesso RBAC. |
| `/agendamento-paciente` | Portal público e limpo para pacientes reservarem vagas disponíveis de forma autônoma. |
| `/painel` | Painel em Dark Mode de alto contraste para TV/monitores de sala de espera com relógio sincronizado, proteção de dados LGPD e chamada em áudio sintetizado. |

---

## 🔐 Perfis de Acesso (RBAC)

O sistema possui 4 níveis de permissão (`UserRole`):

1. **Administrador (`ADMIN`):** Acesso irrestrito a todos os módulos, configurações de agenda, prontuários, financeiro e relatórios.
2. **Gerente (`GERENTE`):** Acesso operacional e estratégico (Dashboard, Agenda, Pacientes, Triagem, Prontuários, Consultório, Financeiro e Relatórios).
3. **Atendente (`ATENDENTE`):** Foco em recepção e atendimento (Agenda, Pacientes, Triagem, Consultório, Prontuários e Pós-Atendimento).
4. **Paciente (`PACIENTE`):** Visão restrita para acompanhamento de consultas e agendamentos.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem & Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Ferramenta de Build:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Geração de PDF:** [jsPDF](https://github.com/parallax/jsPDF)
- **Gerenciamento de Estado:** React Context API (`store/AppContext.tsx`) com persistência em `localStorage`.

---

## 📁 Estrutura de Diretórios

```plaintext
├── components/               # Componentes reutilizáveis
│   ├── AgendaSettingsModal.tsx   # Modal de configuração de status da agenda
│   ├── AvailableSlotsModal.tsx   # Modal de gerenciamento de vagas de autoagendamento
│   ├── Layout.tsx                # Estrutura com barra de navegação e notificações
│   └── NotificationManager.tsx   # Disparador de alertas do sistema
├── pages/                    # Telas e módulos do sistema
│   ├── Agenda.tsx                # Grade de agendamentos e criação de consultas
│   ├── Clinic.tsx                # Atendimento fonoaudiológico e testes
│   ├── Dashboard.tsx             # Indicadores e métricas operacionais
│   ├── ExternalScheduling.tsx    # Portal público de autoagendamento (/agendamento-paciente)
│   ├── Finance.tsx               # Fluxo de caixa e transações financeiras
│   ├── KnowledgeBase.tsx         # Base de conhecimento interativa no sistema
│   ├── Patients.tsx              # Cadastro e histórico de pacientes
│   ├── PostCare.tsx              # Pós-atendimento e mensagens de fidelização
│   ├── PublicPanel.tsx           # Painel de chamada para TV da recepção (/painel)
│   ├── Records.tsx               # Prontuários eletrônicos auditáveis
│   ├── Reports.tsx               # Relatórios e exportação CSV
│   └── Triage.tsx                # Acolhimento e classificação de risco
├── store/
│   └── AppContext.tsx            # Contexto central, estado global e persistência
├── utils/
│   └── helpers.ts                # Formatadores de moeda, datas e cálculo de idade
├── KNOWLEDGE_BASE.md         # Documentação exaustiva de arquitetura e regras de negócio
├── REPOSITORIO_DE_CONHECIMENTO.md # Guia de referência rápida do conhecimento
├── types.ts                  # Interfaces e enumerações TypeScript do domínio
├── package.json              # Dependências e scripts
└── README.md                 # Informações iniciais da aplicação
```

---

## 💻 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- Gerenciador de pacotes `npm`, `yarn` ou `bun`

### Instalação e Execução

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse a aplicação no navegador:**
   ```
   http://localhost:3000
   ```

4. **Para gerar a versão de produção (build):**
   ```bash
   npm run build
   ```

---

## 📖 Repositório de Conhecimento e Documentação

Para consultar a documentação aprofundada contendo:
- Dicionário completo de tipos e dados;
- Análise de auditoria de segurança e diagnóstico de vulnerabilidades da versão atual;
- Procedimentos Operacionais Padrão (POPs);
- Roadmap de migração para banco de dados em nuvem (Firebase Firestore / Cloud SQL);

Consulte o arquivo **[`KNOWLEDGE_BASE.md`](./KNOWLEDGE_BASE.md)** ou acesse a **Base de Conhecimento** diretamente no menu lateral da aplicação!
