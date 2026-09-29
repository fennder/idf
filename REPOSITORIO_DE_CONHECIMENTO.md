# FonoFlow — Repositório de Conhecimento

Este documento consolida o repositório completo de conhecimento da aplicação **FonoFlow**.

O repositório mestre de conhecimento está documentado e mantido no arquivo principal:
👉 **[KNOWLEDGE_BASE.md](./KNOWLEDGE_BASE.md)**

Além disso, a aplicação agora conta com o módulo nativo e interativo **Base de Conhecimento**, acessível diretamente na barra de navegação lateral por todos os perfis de usuários (Administrador, Gerente, Atendente e Paciente).

### Sumário dos Recursos Documentados:
1. **Visão Geral e Arquitetura do Sistema** (React + TypeScript + Tailwind CSS + Context API).
2. **Matriz de Permissões RBAC** (Administrador, Gerente, Atendente, Paciente).
3. **Mapeamento de Módulos:**
   - **Agenda & Vagas Disponíveis:** Agendamento rápido com opção de cadastro imediato de novo paciente e escolha do tipo de atendimento (*Particular* ou *Plano de Saúde*).
   - **Pacientes:** Gestão de cadastros com cálculo automático de idade.
   - **Triagem:** Classificação de risco (*Passa*, *Encaminha*, *Falha*) com início automático de prontuário.
   - **Prontuários:** Tipos de atendimento e histórico de auditoria em conformidade com o CFFa.
   - **Consultório:** Teste da Orelhinha (EOAE), Teste da Linguinha (Protocolo Martinelli), Audiometria e geração de laudos em PDF.
   - **Financeiro:** Controle de fluxo de caixa, pagamentos (PIX, cartões, boleto) e lembretes de cobrança.
   - **Relatórios:** Fechamento e exportação de dados em CSV.
   - **Pós-Atendimento:** Fidelização e disparos humanizados de mensagens via WhatsApp/E-mail.
   - **Painel de Chamada para TV (/painel):** Tela de espera com proteção de dados LGPD (sobrenome abreviado) e chamada com sintetizador de áudio.
   - **Portal de Autoagendamento (/agendamento-paciente):** Agendamento público pelo próprio paciente.
4. **Relatório Completo de Auditoria de Segurança:** Diagnóstico de vulnerabilidades da versão atual (armazenamento em LocalStorage, autenticação simulada) e guia para transição para banco de dados em nuvem.
5. **Procedimentos Operacionais Padrão (POPs)** para a recepção, equipe fonoaudiológica e gestão financeira.
