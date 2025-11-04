# Plano de Limpeza de Warnings ESLint - Padrão Big Tech

## 📊 Status Atual

- **Max Warnings Permitidos**: 10 (configurado em `package.json`)
- **Meta**: Reduzir para 0 warnings em 3 sprints (6 semanas)
- **Responsável**: Time de Frontend
- **Prioridade**: Média (não bloqueia deploys, mas impacta qualidade)

## 🎯 Categorias de Warnings e Plano de Ação

### 1. React Hooks Exhaustive Deps (29 warnings)
**Impacto**: Médio - Pode causar bugs sutis de estado
**Ação**:
- [ ] Adicionar dependências faltantes em `useEffect`/`useMemo`/`useCallback`
- [ ] Documentar casos intencionais com `eslint-disable-next-line` comentado
- **Prazo**: Sprint 1-2
- **Arquivos afetados**: 
  - `src/app/blog/artigo/[slug]/ArtigoPageClient.tsx`
  - `src/app/mobile/page.tsx`
  - `src/components/blog/CategoriesFilters.tsx`
  - `src/components/dashboard/ClientsManagement.tsx`
  - Outros (ver relatório completo)

### 2. React No Unescaped Entities (10+ warnings)
**Impacto**: Baixo - Questão de acessibilidade/HTML válido
**Ação**:
- [ ] Substituir `"` por `&quot;` ou usar template strings
- [ ] Substituir `'` por `&apos;` onde necessário
- **Prazo**: Sprint 1
- **Arquivos afetados**:
  - `src/app/blog/biblioteca-completa/page.tsx`
  - `src/components/blog/SearchResults.tsx`
  - `src/components/resources/ResourcesHero.tsx`
  - Outros

### 3. React Display Name (8 warnings)
**Impacto**: Baixo - Dificulta debug no React DevTools
**Ação**:
- [ ] Adicionar `displayName` a componentes anônimos
- [ ] Extrair componentes anônimos para funções nomeadas
- **Prazo**: Sprint 2
- **Arquivos afetados**:
  - `src/app/landingpages/landprincipal.tsx`
  - `src/app/super-admin/page.OLD.tsx` (arquivo morto - mover)
  - `src/components/dashboard/DeliveryManagement.tsx`
  - Outros

### 4. Next.js No Img Element (5 warnings)
**Impacto**: Médio - Performance (LCP, bandwidth)
**Ação**:
- [ ] Substituir `<img>` por `<Image />` do `next/image`
- [ ] Configurar domínios no `next.config.js` se necessário
- **Prazo**: Sprint 1-2
- **Arquivos afetados**:
  - `src/app/landingpages/recursos/page.tsx`
  - `src/components/blog/FeaturedArticles.tsx`
  - `src/components/institutional/OurHistory.tsx`
  - Outros

### 5. React Hooks Rules of Hooks (3 erros - JÁ CORRIGIDOS ✅)
**Impacto**: Crítico - Quebra regras fundamentais do React
**Status**: ✅ **RESOLVIDO** em `src/hooks/useTeamQuery.ts`

## 📅 Timeline de Limpeza

### Sprint 1 (Semana 1-2)
- [ ] Eliminar warnings de `react/no-unescaped-entities` (10+)
- [ ] Substituir `<img>` por `<Image />` (5)
- [ ] **Meta**: Reduzir de 29 para ~15 warnings

### Sprint 2 (Semana 3-4)
- [ ] Corrigir `react-hooks/exhaustive-deps` (metade dos casos)
- [ ] Adicionar `displayName` a componentes (8)
- [ ] **Meta**: Reduzir de 15 para ~5 warnings

### Sprint 3 (Semana 5-6)
- [ ] Finalizar `react-hooks/exhaustive-deps` restantes
- [ ] Code review e validação
- [ ] **Meta**: Reduzir de 5 para 0 warnings

## 🔧 Ferramentas de Acompanhamento

### Comando para Listar Warnings
```bash
npm run lint 2>&1 | grep "warning" | wc -l
```

### Comando para Gerar Relatório
```bash
npm run lint > lint-report.txt 2>&1
```

### Script de Validação (Opcional)
```bash
# Adicionar ao package.json:
"lint:count": "eslint . --ext .ts,.tsx,.js,.jsx --format json | jq '[.[] | .warningCount] | add'"
```

## 📝 Notas Técnicas

### Arquivos Mortos (.OLD.tsx)
- **Ação Recomendada**: Mover para `legacy/` ou remover do repositório
- **Status**: Ignorados no `.eslintignore` (temporário)
- **Prazo para remoção**: Sprint 1

### Regras TypeScript ESLint
- **Plugins Instalados**: `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
- **Configuração**: `plugin:@typescript-eslint/recommended` em `.eslintrc.json`
- **Nota**: Regras TypeScript funcionam automaticamente via `next/core-web-vitals`

## ✅ Critérios de Sucesso

1. **Warnings reduzidos para 0** em 6 semanas
2. **Todos os `useEffect`/`useMemo` com dependências corretas**
3. **Todas as imagens usando `<Image />` do Next.js**
4. **Todos os componentes com `displayName` ou nomeados**
5. **Arquivos `.OLD.tsx` removidos ou movidos**

## 🚨 Alertas

- Se warnings aumentarem acima de 10, pipeline falha
- Code review deve verificar novos warnings antes de merge
- Warnings devem ser documentados em PR description

## 📚 Referências

- [Next.js ESLint Config](https://nextjs.org/docs/app/api-reference/config/eslint)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [TypeScript ESLint](https://typescript-eslint.io/)

