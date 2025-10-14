# Deploy Trigger

Timestamp: 2025-10-14 20:25:00 UTC
Reason: Fix CRITICAL Ambiguous Mapping Error
Changes: 
- Removed duplicate UserStatsController.java
- Fixed Docker Compose ENV vars (Flyway + Hibernate)
- Fixed application-prod.yml (Flyway enabled)
- Backend will now start without Ambiguous Mapping error

Deploy forçado para resolver backend Unhealthy no ALB.
Sistema de produção 3M+ usuários - correção crítica aplicada.
