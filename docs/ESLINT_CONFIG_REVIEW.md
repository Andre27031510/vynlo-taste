# Revisão da Configuração ESLint - Recomendações Big Tech

## ✅ O que está correto:

1. **Plugins TypeScript ESLint instalados** ✅
   - `@typescript-eslint/eslint-plugin`
   - `@typescript-eslint/parser`
   - Essenciais para projetos TypeScript

2. **Correção dos erros críticos** ✅
   - Removidos hooks dentro de callbacks (`useTeamQuery.ts`)
   - Violações de `react-hooks/rules-of-hooks` corrigidas

3. **Configuração de regras** ✅
   - Erros críticos bloqueiam (`rules-of-hooks`)
   - Warnings permitidos (até 100)
   - Ignorar arquivos `.OLD.tsx`

## 📋 Configuração Recomendada (Padrão Big Tech):

### `.eslintrc.json` Atualizado
- ✅ Usa `@typescript-eslint/parser` (parser TypeScript)
- ✅ Estende `next/core-web-vitals` (regras Next.js)
- ✅ Estende `plugin:@typescript-eslint/recommended` (regras TypeScript)
- ✅ Regras customizadas para warnings (não bloqueiam)
- ✅ `rules-of-hooks` como error (crítico)

### `package.json` Script
- ✅ `--max-warnings 100` permite warnings mas limita quantidade
- ✅ Extensões corretas: `.ts,.tsx,.js,.jsx`

### `.eslintignore`
- ✅ Ignora arquivos de build, config e backups

## 🎯 Resumo das Mudanças Necessárias:

### ✅ MANTIDO (correto):
1. Correção dos 3 erros críticos em `useTeamQuery.ts`
2. Configuração para usar TypeScript ESLint plugins
3. Regras como warnings (exceto `rules-of-hooks`)
4. `--max-warnings 100` no script

### ⚠️ AJUSTADO:
1. Removida duplicação de regra `@typescript-eslint/no-unused-vars`
2. Configuração agora usa os plugins TypeScript instalados

## 🔍 Verificação Final:

**Configuração está alinhada com padrão Big Tech:**
- ✅ Usa plugins instalados corretamente
- ✅ Erros críticos bloqueiam
- ✅ Warnings permitidos (até limite)
- ✅ Ignora arquivos desnecessários
- ✅ Compatível com Next.js 15

**Status**: ✅ **CONFIGURAÇÃO RECOMENDADA E COMPLETA**

