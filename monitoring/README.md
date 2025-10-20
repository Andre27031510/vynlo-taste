# 📊 Monitoring & Observability - Vynlo Taste

## 🎯 **O QUE É ISSO?**

Sistema de monitoring profissional usado pelas **Big Techs** (Google, Netflix, Uber, Spotify).

**Padrão CNCF (Cloud Native Computing Foundation)** - Usado por 94% das empresas cloud-native.

**Benefícios:**
- ✅ Detectar problemas **ANTES** dos clientes
- ✅ Troubleshooting **10x mais rápido**
- ✅ Visibilidade completa do sistema
- ✅ Alertas automatizados
- ✅ SLA 99.9%+ alcançável

---

## 🏗️ **ARQUITETURA**

```
┌─────────────────┐
│  VYNLO BACKEND  │ → Expõe métricas via /actuator/prometheus
│  (Spring Boot)  │
└────────┬────────┘
         │
         ↓ (scraping a cada 15s)
┌─────────────────┐
│  PROMETHEUS     │ → Coleta e armazena métricas (TSDB)
│  Port: 9090     │
└────────┬────────┘
         │
         ↓ (query)
┌─────────────────┐
│  GRAFANA        │ → Visualiza métricas em dashboards
│  Port: 3001     │
└─────────────────┘
```

---

## 🚀 **COMO USAR NO SERVIDOR UBUNTU**

### **1. Fazer Deploy Completo**

```bash
cd ~/app

# Pull das novas imagens
docker-compose -f docker-compose.prod.yml pull

# Subir TODOS os serviços (incluindo Prometheus + Grafana)
docker-compose -f docker-compose.prod.yml up -d

# Aguardar 30 segundos
sleep 30

# Verificar se TODOS os containers subiram
docker ps
```

**Você deve ver:**
```
vynlo-postgres
vynlo-redis
vynlo-backend
vynlo-frontend
vynlo-prometheus  ← NOVO
vynlo-grafana     ← NOVO
```

---

### **2. Acessar Prometheus**

```bash
# No servidor Ubuntu
curl http://localhost:9090/-/healthy

# Ou no navegador (se tiver acesso ao servidor)
http://<IP_DO_SERVIDOR>:9090
```

**Queries para testar:**
```
# Total de requisições por segundo
rate(http_server_requests_seconds_count{job="vynlo-backend"}[5m])

# Latência P99
histogram_quantile(0.99, rate(http_server_requests_seconds_bucket{job="vynlo-backend"}[5m]))

# Uso de memória JVM
jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} * 100

# Taxa de erro
sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m])) * 100
```

---

### **3. Acessar Grafana**

```bash
# No navegador (se tiver acesso ao servidor)
http://<IP_DO_SERVIDOR>:3001

# Login padrão:
Usuário: admin
Senha: admin

# ✅ IMPORTANTE: Trocar senha na primeira vez!
```

**Após login:**
1. Ir em "Dashboards"
2. Procurar "Vynlo Taste - Overview"
3. Ver métricas em tempo real!

---

## 📈 **MÉTRICAS DISPONÍVEIS**

### **Infrastructure Metrics:**
```
✅ CPU Usage
✅ Memory Usage (Heap + Non-Heap)
✅ Threads (live, peak, daemon)
✅ Garbage Collection
✅ Disk I/O
```

### **Application Metrics:**
```
✅ Request Rate (RPS)
✅ Request Latency (P50, P90, P95, P99)
✅ Error Rate (%)
✅ Response Status Codes
```

### **Database Metrics:**
```
✅ Connection Pool (active, idle, total)
✅ Query execution time
✅ Connection wait time
```

### **Cache Metrics:**
```
✅ Cache Hit Rate
✅ Cache Miss Rate
✅ Cache Evictions
✅ Cache Size
```

### **Business Metrics (Multi-Tenancy):**
```
✅ Orders por tenant
✅ Revenue por tenant
✅ Products criados
✅ Users ativos
```

---

## ⚠️ **ALERTAS CONFIGURADOS**

### **Críticos (Ação Imediata):**
1. **ServiceDown** - Backend offline por 1+ minuto
2. **HighCPUUsage** - CPU > 80% por 5+ minutos
3. **HighMemoryUsage** - Memória > 85% por 5+ minutos
4. **HighErrorRate** - Taxa de erro > 5%

### **Warnings (Investigar):**
1. **HighLatencyP99** - P99 > 1 segundo
2. **HighDatabaseConnections** - Pool > 80%
3. **LowCacheHitRate** - Hit rate < 50%

---

## 🔧 **TROUBLESHOOTING**

### **Prometheus não está coletando métricas:**

```bash
# 1. Verificar se backend expõe /actuator/prometheus
curl http://localhost:8080/api/actuator/prometheus

# 2. Verificar logs do Prometheus
docker logs vynlo-prometheus --tail 50

# 3. Verificar targets no Prometheus
# Acessar: http://localhost:9090/targets
```

### **Grafana não conecta ao Prometheus:**

```bash
# 1. Verificar logs do Grafana
docker logs vynlo-grafana --tail 50

# 2. Verificar se Prometheus está acessível do Grafana
docker exec -it vynlo-grafana wget -O- http://prometheus:9090/-/healthy
```

---

## 📚 **RECURSOS**

- **Prometheus Docs:** https://prometheus.io/docs
- **Grafana Docs:** https://grafana.com/docs
- **Google SRE Book:** https://sre.google/books
- **Spring Boot Actuator:** https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html

---

## 🎓 **EMPRESAS QUE USAM**

✅ Google, Netflix, Uber, Spotify, Airbnb
✅ Nubank, Ifood, Stone, QuintoAndar
✅ 94% das empresas cloud-native (CNCF Survey 2024)

