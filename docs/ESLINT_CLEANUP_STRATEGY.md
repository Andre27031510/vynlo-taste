# Estratégia de Limpeza ESLint - Padrão Big Tech

## 🎯 Objetivo
Reduzir warnings de 702 para 0 de forma incremental e segura, sem bloquear o pipeline.

## 📍 Onde Executar Cada Fase

### ✅ **Localmente (Terminal VS Code)**
**Fases 0-4**: Trabalho interativo de limpeza
- Permite iteração rápida (testar → corrigir → testar)
- Não bloqueia o pipeline durante a limpeza
- Permite commits incrementais por módulo

### ✅ **Pipeline CI/CD**
**Fase 5**: Gate de qualidade final
- Valida que warnings não aumentaram
- Bloqueia merge se novos warnings forem introduzidos
- Garante que limpeza foi aplicada

---

## 🔄 Estratégia Temporária (Enquanto Limpamos)

### Situação Atual
- **702 warnings** (limite: 10)
- Pipeline **bloqueado**

### Solução Temporária
Aumentar temporariamente o limite para permitir que o pipeline funcione enquanto limpamos:

```json
// package.json (TEMPORÁRIO)
"lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 750"
```

**Meta**: Reduzir para 0 em 2-3 sprints

---

## 📋 Fases de Execução

### **Fase 0 – Preparação (Local)**
```bash
cd frontend
npm ci
mkdir -p tmp
```

### **Fase 1 – Baseline (Local)**
```bash
# Gerar relatório completo
npm run lint -- --max-warnings=0 --format=json > tmp/eslint-full.json

# Resumo legível
npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings=0 --quiet --format=table > tmp/eslint-summary.txt

# Contar warnings por arquivo
jq 'group_by(.filePath) | map({file: .[0].filePath, count: length}) | sort_by(.count) | reverse' tmp/eslint-full.json > tmp/eslint-by-file.json
```

### **Fase 2 – Limpeza por Domínio (Local, Incremental)**

#### Módulo 1: Blog/Institucional
```bash
# Verificar warnings
npx eslint src/app/blog --ext .ts,.tsx --max-warnings=0

# Corrigir automaticamente o que for possível
npx eslint src/app/blog --ext .ts,.tsx --fix

# Verificar novamente
npx eslint src/app/blog --ext .ts,.tsx --max-warnings=0

# Repetir para components
npx eslint src/components/blog --ext .ts,.tsx --fix
npx eslint src/components/institutional --ext .ts,.tsx --fix
```

#### Módulo 2: Landing Pages
```bash
npx eslint src/app/landingpages --ext .ts,.tsx --fix
npx eslint src/components/landing --ext .ts,.tsx --fix
```

#### Módulo 3: Dashboard (Crítico)
```bash
# Dashboard tem mais warnings - corrigir com cuidado
npx eslint src/app/dashboard --ext .ts,.tsx --fix
npx eslint src/components/dashboard --ext .ts,.tsx --fix

# Hooks com regra crítica de exhaustive-deps
npx eslint src/hooks --ext .ts,.tsx --fix --rule 'react-hooks/exhaustive-deps: error'
```

#### Módulo 4: Core (Services/Utils/Contexts)
```bash
npx eslint src/contexts --ext .ts,.tsx --fix
npx eslint src/services --ext .ts --fix
npx eslint src/utils --ext .ts,.tsx --fix
```

### **Fase 3 – Verificação Incremental (Local)**
Após cada módulo, verificar impacto:
```bash
# Verificar total de warnings restantes
npm run lint 2>&1 | grep -E "warning|error" | wc -l

# Verificar módulo específico
npx eslint src/components/dashboard --ext .ts,.tsx --max-warnings=0
```

### **Fase 4 – Scripts Node (Local)**
```bash
# Scripts já estão ignorados no .eslintignore
# Mas se quiser validar:
npx eslint scripts --ext .js --max-warnings=0 || echo "Scripts ignorados (CommonJS)"
```

### **Fase 5 – Pipeline Gate (CI/CD)**
Após limpeza completa, atualizar pipeline:

```yaml
# .github/workflows/ci-cd-v2.yml
- name: Run Frontend Lint
  run: |
    npm run lint || {
      echo "⚠️ Lint encontrou problemas"
      echo "   Errors críticos bloqueiam o build"
      echo "   Warnings permitidos: 0 (meta alcançada)"
      exit 1
    }
```

E atualizar `package.json`:
```json
"lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0"
```

---

## 🚀 Estratégia Recomendada (Big Tech)

### **Agora (Imediato)**
1. ✅ Aumentar limite temporário para 750 (permite pipeline funcionar)
2. ✅ Criar script de limpeza automática por módulo
3. ✅ Commitar correções incrementais por módulo

### **Sprint 1 (Semana 1-2)**
1. Limpar módulos não-críticos (Blog, Landing Pages)
2. Meta: Reduzir de 702 para ~400 warnings

### **Sprint 2 (Semana 3-4)**
1. Limpar Dashboard e Hooks (crítico)
2. Meta: Reduzir de 400 para ~100 warnings

### **Sprint 3 (Semana 5-6)**
1. Limpar Services/Utils/Contexts
2. Meta: Reduzir de 100 para 0 warnings
3. **Atualizar pipeline para `--max-warnings 0`**

---

## 🛠️ Scripts de Automação

### Script: Limpar Módulo
```bash
#!/bin/bash
# cleanup-module.sh <module-path>

MODULE=$1
if [ -z "$MODULE" ]; then
  echo "Uso: ./cleanup-module.sh src/components/dashboard"
  exit 1
fi

echo "🧹 Limpando módulo: $MODULE"
echo "1. Correção automática..."
npx eslint "$MODULE" --ext .ts,.tsx --fix

echo "2. Verificando warnings restantes..."
WARNINGS=$(npx eslint "$MODULE" --ext .ts,.tsx --format=compact 2>&1 | grep -c warning || echo "0")
echo "   Warnings restantes: $WARNINGS"

if [ "$WARNINGS" -eq "0" ]; then
  echo "✅ Módulo limpo!"
else
  echo "⚠️ Ainda há $WARNINGS warnings - revisar manualmente"
fi
```

### Script: Gerar Relatório
```bash
#!/bin/bash
# generate-report.sh

echo "📊 Gerando relatório ESLint..."

npm run lint -- --format=json > tmp/eslint-$(date +%Y%m%d).json

TOTAL=$(jq 'length' tmp/eslint-$(date +%Y%m%d).json)
WARNINGS=$(jq '[.[] | select(.severity == 1)] | length' tmp/eslint-$(date +%Y%m%d).json)
ERRORS=$(jq '[.[] | select(.severity == 2)] | length' tmp/eslint-$(date +%Y%m%d).json)

echo "Total: $TOTAL problemas"
echo "Warnings: $WARNINGS"
echo "Errors: $ERRORS"
```

---

## ✅ Checklist de Validação

Antes de fazer merge:
- [ ] Módulo específico tem 0 warnings: `npx eslint <module> --max-warnings=0`
- [ ] Testes passam: `npm run test`
- [ ] Build passa: `npm run build`
- [ ] Warnings totais não aumentaram: `npm run lint 2>&1 | grep -c warning`

---

## 📚 Referências

- [ESLint Auto-fix](https://eslint.org/docs/latest/use/command-line-interface#--fix)
- [ESLint JSON Format](https://eslint.org/docs/latest/use/formatters/#json)
- [Big Tech Code Quality Standards](https://github.com/airbnb/javascript)

