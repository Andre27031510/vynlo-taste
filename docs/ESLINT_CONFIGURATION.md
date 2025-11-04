# Configuração ESLint - Documentação Técnica

## 📦 Plugins Instalados

### TypeScript ESLint
- `@typescript-eslint/eslint-plugin`: ^8.46.3
- `@typescript-eslint/parser`: ^8.46.3

**Propósito**: Análise estática de código TypeScript com regras específicas do TypeScript.

### Next.js ESLint Config
- `eslint-config-next`: ^15.2.4

**Propósito**: Configuração padrão do Next.js que inclui:
- Regras React/JSX
- Regras Next.js específicas
- Detecção automática de TypeScript (se plugins instalados)

## ⚙️ Configuração Atual

### `.eslintrc.json`
```json
{
  "extends": [
    "next/core-web-vitals",                    // ✅ Next.js detecta TypeScript automaticamente
    "plugin:@typescript-eslint/recommended"     // ✅ Usa plugins TypeScript instalados
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",      // ⛔ Bloqueia (crítico)
    // ... outras regras como "warn"
  }
}
```

### Como Funciona

1. **`next/core-web-vitals`**:
   - Detecta automaticamente se `@typescript-eslint/parser` está instalado
   - Configura parser TypeScript automaticamente
   - **Não precisa** especificar `parser` manualmente

2. **`plugin:@typescript-eslint/recommended`**:
   - Requer `@typescript-eslint/eslint-plugin` instalado
   - Adiciona regras TypeScript recomendadas
   - Funciona junto com `next/core-web-vitals`

## 🔍 Regras Customizadas

### Erros (Bloqueiam Pipeline)
- `react-hooks/rules-of-hooks`: Violação das regras fundamentais do React

### Warnings (Permitidos até 10)
- `react-hooks/exhaustive-deps`: Dependências faltantes em hooks
- `@next/next/no-img-element`: Uso de `<img>` em vez de `<Image />`
- `react/no-unescaped-entities`: Caracteres não escapados em JSX
- `react/display-name`: Componentes sem displayName
- `@typescript-eslint/no-unused-vars`: Variáveis não usadas
- `@typescript-eslint/no-explicit-any`: Uso de `any`

## 📝 Scripts

### `npm run lint`
```bash
eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 10
```

- **Max Warnings**: 10 (meta: reduzir para 0)
- **Extensões**: TypeScript e JavaScript
- **Falha**: Se > 10 warnings OU qualquer error

## 🚫 Arquivos Ignorados

### `.eslintignore`
- `node_modules`, `.next`, `out`
- `*.config.js`, `*.config.ts`
- `*.d.ts`, `*.OLD.tsx`
- `cypress`, `public`

### Nota sobre `.OLD.tsx`
- **Status**: Temporariamente ignorado
- **Ação Recomendada**: Remover ou mover para `legacy/`
- **Prazo**: Sprint 1

## ⚠️ Importante

### Regras TypeScript ESLint
Se você adicionar regras customizadas que mencionam `@typescript-eslint/*`, elas **já funcionam** porque:
1. Plugins estão instalados
2. `plugin:@typescript-eslint/recommended` está em `extends`
3. `next/core-web-vitals` detecta automaticamente

**Exemplo de regra customizada que funciona:**
```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  }
}
```

### Não Precisa Especificar Manualmente
- ❌ **Não precisa**: `"parser": "@typescript-eslint/parser"`
- ❌ **Não precisa**: `"plugins": ["@typescript-eslint"]`
- ✅ **Já funciona**: Via `next/core-web-vitals` + `plugin:@typescript-eslint/recommended`

## 🔄 Migração Futura

Se precisar de regras TypeScript mais avançadas:
1. Adicionar `parserOptions.project` (análise de tipos)
2. Adicionar regras específicas do TypeScript
3. **Nota**: `parserOptions.project` pode ser lento em projetos grandes

## 📚 Referências

- [Next.js ESLint](https://nextjs.org/docs/app/api-reference/config/eslint)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)

