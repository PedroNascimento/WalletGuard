# 🚀 WalletGuard: Análise e Roadmap v3.0

**Data:** 28/11/2025
**Status:** Planejamento Estratégico

---

## 1. Visão Geral e Estado Atual

O WalletGuard atingiu um marco importante com a versão **2.0.0**. O sistema deixou de ser apenas um registro de despesas para se tornar uma ferramenta de **planejamento financeiro** com a introdução de Metas e Orçamentos.

A base técnica é sólida (React 19, Vite, Supabase), segura (RLS) e performática. No entanto, para competir com grandes apps do mercado (Mobills, Organizze), precisamos focar em **automação** e **inteligência**. O usuário não quer lançar gastos manualmente para sempre.

---

## 2. Análise Técnica (SWOT)

### 💪 Forças (Strengths)
- **Stack Moderna:** React 19 + Vite + Tailwind garante desenvolvimento rápido e performance excelente.
- **Backend Serverless:** Supabase reduz custo e complexidade de manutenção.
- **Segurança:** RLS garante isolamento de dados nativamente no banco.
- **PWA:** Funciona como app nativo sem o custo de desenvolvimento mobile.

### ⚠️ Fraquezas (Weaknesses)
- **Testes:** Cobertura de testes unitários e E2E é praticamente inexistente após a refatoração. Isso aumenta o risco de regressão.
- **Entrada Manual:** O sistema depende 100% da disciplina do usuário para lançar dados.
- **Dependência de SQL Manual:** A criação de tabelas e policies ainda requer execução de scripts manuais.

### 🎯 Oportunidades (Opportunities)
- **Open Banking / OFX:** Automatizar a entrada de dados importando extratos bancários.
- **IA / Insights:** Usar os dados para dar dicas financeiras personalizadas.
- **Gamificação:** Criar um sistema de níveis/conquistas para incentivar a economia.

### 🛡️ Ameaças (Threats)
- **Escalabilidade do Banco:** Tabelas grandes (ex: transactions) podem ficar lentas sem indexação adequada no futuro.
- **Manutenção do RLS:** Políticas de segurança complexas podem ser difíceis de manter e testar.

---

## 3. Propostas de Funcionalidades (v3.0)

### 🌟 1. Automação de Dados (Prioridade Alta)
O maior atrito de apps financeiros é o lançamento manual.
- **Importação OFX/CSV:** Permitir arrastar o extrato do banco e o sistema categorizar automaticamente.
- **Integração Open Finance:** (Futuro) Conectar diretamente com bancos via API (ex: Pluggy/Belvo).

### 🌟 2. Múltiplas Carteiras (Prioridade Média)
Permitir separar contextos financeiros.
- **Cenários:** Finanças Pessoais vs. Casa (Conjunta) vs. Trabalho (PJ).
- **Funcionalidade:** Switch de contexto na sidebar que filtra todos os dados.

### 🌟 3. Inteligência Financeira (Prioridade Média)
Transformar dados em informação acionável.
- **Alertas Inteligentes:** "Você já gastou 80% do seu orçamento de Lazer e ainda é dia 15."
- **Análise de Tendências:** "Seus gastos com Mercado subiram 15% nos últimos 3 meses."

### 🌟 4. Gamificação (Prioridade Baixa)
Engajamento do usuário.
- **Conquistas:** "Poupador Iniciante" (Guardou 10% da renda), "Sniper de Metas" (Atingiu meta no prazo).
- **Níveis:** Baseado na consistência de uso e economia.

---

## 4. Melhorias de UX/UI

- **Onboarding Guiado:** Um tour interativo para novos usuários configurarem a primeira conta e meta.
- **Dashboard Personalizável:** Widgets arrastáveis (Drag & Drop) para o usuário escolher o que ver.
- **Dark Mode Automático:** Sincronizar com o sistema operacional (já suportado, mas pode refinar).
- **Acessibilidade (a11y):** Melhorar navegação por teclado e leitores de tela nos formulários.

---

## 5. Infraestrutura e DevOps

- **CI/CD Pipeline:** Configurar GitHub Actions para rodar testes e lint no Pull Request.
- **Monitoramento:** Integrar Sentry ou LogRocket para rastrear erros em produção.
- **Backups Automáticos:** Script para dump periódico dos dados do usuário (JSON/CSV) enviado por email.

---

## 6. Roadmap Sugerido

### ✅ v2.1.0: Qualidade e Estabilidade (Curto Prazo)
- [ ] Recriar testes unitários (Vitest).
- [ ] Configurar CI (GitHub Actions).
- [ ] Auditoria de Acessibilidade.

### 🚧 v2.2.0: Automação (Médio Prazo)
- [ ] Importador de arquivos OFX/CSV.
- [ ] Motor de categorização automática (Regex simples -> IA futura).
- [ ] Conciliação bancária (Comparar extrato x lançamentos).

### 🔮 v3.0.0: A Era da Inteligência (Longo Prazo)
- [ ] Múltiplas Carteiras.
- [ ] Dashboard Personalizável.
- [ ] Sistema de Insights/Alertas.
- [ ] Gamificação.

---

**Recomendação Imediata:** Focar na **v2.1.0** para garantir que a base esteja sólida antes de adicionar a complexidade da importação de dados na v2.2.0.
