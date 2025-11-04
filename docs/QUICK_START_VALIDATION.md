# Quick Start - Validação Rápida

## Validação Rápida do Pipeline

### No Linux/WSL/Git Bash
```bash
# Executar validação completa
./deploy/scripts/validate-pipeline.sh
```

### No PowerShell (Windows)
```powershell
# Validar docker-compose manualmente
$env:DB_PASSWORD = "VALIDATION_PLACEHOLDER"
$env:MAIL_PASSWORD = "VALIDATION_PLACEHOLDER"
$env:BACKEND_TAG = "latest"
$env:FRONTEND_TAG = "latest"
docker compose -f docker-compose.prod.yml config --quiet

# Verificar scripts existem
Get-ChildItem deploy/scripts/*.sh | Select-Object Name
```

## Erro Esperado no Windows

### "chmod não reconhecido"
- **Causa**: `chmod` é comando Unix, não existe no PowerShell
- **Solução**: Ignorar - scripts já têm permissões corretas no repositório
- **No CI/CD**: Funciona perfeitamente (roda em Linux)

### "required variable DB_PASSWORD is missing"
- **Causa**: Variável de ambiente não configurada
- **Solução**: Configurar variáveis ou usar placeholders (veja acima)
- **No deploy real**: Variáveis vêm do AWS Secrets Manager automaticamente

## Validação Completa

Para validação completa, use uma dessas opções:

1. **GitHub Actions** (automático em push)
2. **WSL** (Windows Subsystem for Linux)
3. **Git Bash** (incluído com Git for Windows)

Veja [WINDOWS_COMPATIBILITY.md](./WINDOWS_COMPATIBILITY.md) para detalhes.

