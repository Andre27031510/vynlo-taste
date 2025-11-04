# Padrões de Qualidade de Código - Big Tech

## 📊 ESLint - Política de Warnings

### Limite Atual
- **Max Warnings**: 10 (configurado em `package.json`)
- **Meta**: Reduzir para 0 em 6 semanas (3 sprints)
- **Status**: ✅ Monitorado e documentado

### Categorias de Warnings

#### 🔴 Críticos (Bloqueiam Pipeline)
- `react-hooks/rules-of-hooks`: Violação das regras fundamentais do React
  - **Status**: ✅ Resolvido (3 erros corrigidos em `useTeamQuery.ts`)

#### 🟡 Warnings (Permitidos Temporariamente)
- `react-hooks/exhaustive-deps`: Dependências faltantes (29 warnings)
- `react/no-unescaped-entities`: Caracteres não escapados (10+ warnings)
- `react/display-name`: Componentes sem displayName (8 warnings)
- `@next/next/no-img-element`: Uso de `<img>` em vez de `<Image />` (5 warnings)
- `@typescript-eslint/no-unused-vars`: Variáveis não usadas
- `@typescript-eslint/no-explicit-any`: Uso de `any`

### Plano de Redução
- **Sprint 1**: Eliminar `no-unescaped-entities` e `no-img-element` (meta: 15 warnings)
- **Sprint 2**: Corrigir metade dos `exhaustive-deps` e `display-name` (meta: 5 warnings)
- **Sprint 3**: Finalizar todos os warnings (meta: 0 warnings)

Ver: `docs/ESLINT_WARNINGS_CLEANUP_PLAN.md`

## 🗂️ Arquivos Legacy/Backup

### Política
- ❌ **Não manter** arquivos `.OLD.tsx` na raiz do projeto
- ✅ **Remover** ou mover para `legacy/` (excluído do lint)
- ✅ **Documentar** em commit message se necessário para histórico

### Arquivos Identificados
- `frontend/src/app/super-admin/page.OLD.tsx` (3.022 linhas)
  - **Ação**: Remover ou mover para `legacy/`
  - **Prazo**: Sprint 1

### Git Ignore
- `.gitignore` atualizado para ignorar `*.OLD.tsx`, `*.OLD.ts`, `*.OLD.js`
- Arquivos já existentes devem ser removidos manualmente

## 📝 Documentação Técnica

### ESLint
- **Configuração**: `docs/ESLINT_CONFIGURATION.md`
- **Plano de Limpeza**: `docs/ESLINT_WARNINGS_CLEANUP_PLAN.md`
- **Plugins**: TypeScript ESLint instalados e configurados

### Padrões
- **Next.js 15**: Usar `<Image />` em vez de `<img>`
- **React Hooks**: Todas as dependências devem estar em arrays
- **TypeScript**: Evitar `any`, usar tipos específicos
- **Componentes**: Nomear todos os componentes (displayName)

## ✅ Checklist PR

Antes de fazer merge:
- [ ] Lint passa sem novos warnings
- [ ] Warnings existentes documentados (se relevantes)
- [ ] Arquivos `.OLD.*` removidos ou movidos
- [ ] Componentes com `displayName` ou nomeados
- [ ] `<Image />` usado em vez de `<img>`
- [ ] Dependências de hooks corretas

## 🎯 Métricas de Qualidade

### Atuais
- **Warnings**: ~29 (meta: 0)
- **Errors Críticos**: 0 ✅
- **Arquivos Legacy**: 1 (meta: 0)

### Timeline
- **6 semanas**: Zero warnings
- **2 semanas**: Remover arquivos legacy
- **Contínuo**: Manter zero warnings

## 📚 Referências

- [Next.js ESLint](https://nextjs.org/docs/app/api-reference/config/eslint)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [TypeScript ESLint](https://typescript-eslint.io/)

