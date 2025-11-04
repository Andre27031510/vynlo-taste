# Compatibilidade Windows - Scripts de Deploy

## ⚠️ Importante

Os scripts de deploy (`deploy/scripts/*.sh`) são **scripts bash** e foram projetados para serem executados em **ambiente Linux/Unix**.

## Executando no Windows

### Opção 1: WSL (Windows Subsystem for Linux) - RECOMENDADO
```bash
# Instalar WSL se não tiver
wsl --install

# Executar scripts via WSL
wsl bash deploy/scripts/validate-pipeline.sh
```

### Opção 2: Git Bash
```bash
# Instalar Git Bash (incluído com Git for Windows)
# Executar scripts via Git Bash
bash deploy/scripts/validate-pipeline.sh
```

### Opção 3: Docker (para validação de compose)
```powershell
# No PowerShell, você pode validar docker-compose sem executar scripts bash
$env:DB_PASSWORD = "placeholder"
$env:MAIL_PASSWORD = "placeholder"
docker compose -f docker-compose.prod.yml config
```

## Comandos que Não Funcionam no PowerShell

### `chmod`
- **Problema**: `chmod` é comando Unix, não existe no PowerShell
- **Solução**: Scripts já têm permissões corretas no repositório
- **No Linux**: Scripts serão executáveis automaticamente (git preserva permissões)

### `set -euo pipefail`
- **Problema**: Não é comando, é diretiva bash
- **Solução**: Funciona apenas em bash (WSL, Git Bash, Linux)

## Validação no Windows

### Validar Docker Compose Manualmente
```powershell
# No PowerShell
$env:DB_PASSWORD = "VALIDATION_PLACEHOLDER"
$env:MAIL_PASSWORD = "VALIDATION_PLACEHOLDER"
$env:BACKEND_TAG = "latest"
$env:FRONTEND_TAG = "latest"
$env:AWS_REGION = "us-east-1"
$env:GRAFANA_PASSWORD = "admin"

docker compose -f docker-compose.prod.yml config --quiet
```

### Validar Scripts (verificação estática)
```powershell
# Verificar se scripts existem
Get-ChildItem deploy/scripts/*.sh

# Verificar se têm set -euo pipefail
Select-String -Path deploy/scripts/*.sh -Pattern "set -euo pipefail"
```

## CI/CD Pipeline

**Importante**: O pipeline CI/CD roda em **Linux** (GitHub Actions), então todos os scripts funcionam corretamente lá.

Você não precisa executar os scripts localmente no Windows - eles são executados automaticamente pelo GitHub Actions durante o deploy.

## Desenvolvimento Local

### Para desenvolvimento/teste local:
1. Use WSL para ambiente Linux completo
2. Ou use Git Bash para executar scripts bash
3. Ou valide apenas o que é possível no PowerShell (docker compose config)

### Para validação completa:
- Execute o pipeline no GitHub Actions (dispara automaticamente em push)
- Ou use WSL para executar `validate-pipeline.sh` localmente

## Resumo

- ✅ **CI/CD**: Funciona perfeitamente (roda em Linux)
- ✅ **WSL**: Funciona perfeitamente (ambiente Linux)
- ✅ **Git Bash**: Funciona para scripts bash
- ⚠️ **PowerShell**: Apenas validação manual de docker-compose
- ❌ **PowerShell**: Não executa scripts bash diretamente

**Recomendação**: Use WSL para desenvolvimento local ou confie no CI/CD para validação completa.

