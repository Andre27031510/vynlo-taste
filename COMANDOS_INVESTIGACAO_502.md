# 🔍 COMANDOS PARA INVESTIGAR ERROS 502 BAD GATEWAY

## 📊 ANÁLISE DOS LOGS FORNECIDOS:

### 🚨 PROBLEMAS IDENTIFICADOS:
1. **502 Bad Gateway** - Servidor backend não está respondendo
2. **Auto-sync silent fail** - Falha na sincronização Firebase
3. **Failed to fetch** - Erro de conectividade com API
4. **OPTIONS request falhando** - Problema de CORS ou servidor

---

## 🖥️ COMANDOS PARA INVESTIGAR NO SERVIDOR:

### 1. VERIFICAR STATUS DO SERVIÇO BACKEND:
```bash
# Verificar se o serviço está rodando
sudo systemctl status vynlo-taste-backend
# ou
sudo service vynlo-taste-backend status

# Verificar processos Java
ps aux | grep java
ps aux | grep spring-boot
```

### 2. VERIFICAR LOGS DO BACKEND:
```bash
# Logs do sistema
sudo journalctl -u vynlo-taste-backend -f --since "10 minutes ago"

# Logs do aplicativo (se usando arquivo)
tail -f /var/log/vynlo-taste/application.log
tail -f /opt/vynlo-taste/logs/application.log

# Logs do Spring Boot
tail -f /var/log/vynlo-taste/spring-boot.log
```

### 3. VERIFICAR RECURSOS DO SERVIDOR:
```bash
# Uso de CPU e memória
top
htop
free -h
df -h

# Verificar se há processos travados
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10
```

### 4. VERIFICAR CONECTIVIDADE DE REDE:
```bash
# Testar conectividade com o banco
telnet localhost 5432
# ou
nc -zv localhost 5432

# Verificar portas abertas
netstat -tlnp | grep :8080
netstat -tlnp | grep :5432

# Testar DNS
nslookup api.vynlotech.com
ping api.vynlotech.com
```

### 5. VERIFICAR BANCO DE DADOS:
```bash
# Conectar ao PostgreSQL
sudo -u postgres psql -d vynlo_taste

# Verificar conexões ativas
SELECT * FROM pg_stat_activity;

# Verificar locks
SELECT * FROM pg_locks;

# Verificar queries lentas
SELECT query, state, query_start, state_change 
FROM pg_stat_activity 
WHERE state != 'idle' 
ORDER BY query_start;
```

### 6. VERIFICAR NGINX/LOAD BALANCER:
```bash
# Logs do Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Verificar configuração do Nginx
sudo nginx -t

# Verificar status do Nginx
sudo systemctl status nginx
```

### 7. VERIFICAR DOCKER (SE USANDO):
```bash
# Verificar containers
docker ps -a
docker logs vynlo-taste-backend
docker stats

# Verificar recursos do Docker
docker system df
docker system prune -f
```

---

## 🔧 COMANDOS DE DIAGNÓSTICO ESPECÍFICOS:

### VERIFICAR HEALTH CHECK:
```bash
# Testar endpoint de health
curl -v http://localhost:8080/actuator/health
curl -v https://api.vynlotech.com/actuator/health

# Testar endpoint específico que está falhando
curl -v -X OPTIONS https://api.vynlotech.com/api/v1/products/stats \
  -H "Origin: https://www.vynlotech.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,x-client-version,x-request-id"
```

### VERIFICAR CONFIGURAÇÕES:
```bash
# Verificar variáveis de ambiente
env | grep -E "(SPRING|DATABASE|FIREBASE)"

# Verificar configurações do Spring Boot
cat /opt/vynlo-taste/application.properties
cat /opt/vynlo-taste/application.yml
```

### VERIFICAR PERMISSÕES:
```bash
# Verificar permissões dos arquivos
ls -la /opt/vynlo-taste/
ls -la /var/log/vynlo-taste/

# Verificar usuário do serviço
id vynlo-taste
```

---

## 🚨 COMANDOS DE EMERGÊNCIA:

### REINICIAR SERVIÇOS:
```bash
# Reiniciar backend
sudo systemctl restart vynlo-taste-backend

# Reiniciar Nginx
sudo systemctl restart nginx

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### VERIFICAR ESPAÇO EM DISCO:
```bash
# Verificar espaço em disco
df -h
du -sh /var/log/*
du -sh /opt/vynlo-taste/logs/*

# Limpar logs antigos
sudo find /var/log -name "*.log" -mtime +7 -delete
```

### VERIFICAR MEMÓRIA:
```bash
# Verificar swap
swapon -s
free -h

# Verificar processos consumindo memória
ps aux --sort=-%mem | head -20
```

---

## 📋 CHECKLIST DE DIAGNÓSTICO:

### ✅ VERIFICAÇÕES BÁSICAS:
- [ ] Serviço backend está rodando?
- [ ] Porta 8080 está aberta?
- [ ] Banco de dados está acessível?
- [ ] Nginx está funcionando?
- [ ] Há espaço em disco suficiente?
- [ ] Há memória disponível?

### ✅ VERIFICAÇÕES AVANÇADAS:
- [ ] Logs mostram erros específicos?
- [ ] Health check responde?
- [ ] CORS está configurado corretamente?
- [ ] Firebase está configurado?
- [ ] Multi-tenancy está funcionando?
- [ ] Circuit breakers estão ativos?

---

## 🎯 PRÓXIMOS PASSOS:

1. **Execute os comandos de verificação básica**
2. **Analise os logs para identificar erros específicos**
3. **Verifique recursos do servidor (CPU, memória, disco)**
4. **Teste conectividade com banco de dados**
5. **Verifique configurações de CORS e Firebase**
6. **Se necessário, reinicie os serviços**

---

## 📞 COMANDOS PARA COLETA DE INFORMAÇÕES:

```bash
# Coletar informações completas
echo "=== STATUS DOS SERVIÇOS ===" > diagnostico.txt
sudo systemctl status vynlo-taste-backend >> diagnostico.txt
sudo systemctl status nginx >> diagnostico.txt
sudo systemctl status postgresql >> diagnostico.txt

echo "=== RECURSOS DO SERVIDOR ===" >> diagnostico.txt
free -h >> diagnostico.txt
df -h >> diagnostico.txt
top -bn1 >> diagnostico.txt

echo "=== LOGS RECENTES ===" >> diagnostico.txt
sudo journalctl -u vynlo-taste-backend --since "1 hour ago" >> diagnostico.txt

echo "=== CONECTIVIDADE ===" >> diagnostico.txt
netstat -tlnp | grep :8080 >> diagnostico.txt
netstat -tlnp | grep :5432 >> diagnostico.txt
```

**Execute estes comandos no servidor e compartilhe os resultados para análise detalhada.**