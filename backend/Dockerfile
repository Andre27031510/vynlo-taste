# Builder: Maven + Temurin 21 (Alpine)
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy parent pom
COPY pom.xml .

# Copy modules
COPY core-module/ ./core-module/
# financial-module DESABILITADO - funcionalidade movida para core-module
# Disabled: 2025-10-11 13:46 UTC - Evitar duplicação e conflitos
# COPY financial-module/ ./financial-module/

# Build application (apenas core-module agora)
RUN mvn -B -DskipTests clean package

# Runtime: Temurin 21 JRE (Alpine)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl

# Copy JAR from core-module
COPY --from=builder /app/core-module/target/*.jar app.jar

EXPOSE 8080

# FASE 1: Proteção OOM - Limites heap Java
# -Xms512m: Heap inicial 512 MB (evita resize durante runtime)
# -Xmx1024m: Heap máximo 1 GB (protege contra OOM, 4GB EC2 = OK)
# -XX:MaxMetaspaceSize=256m: Metaspace 256 MB (classes, métodos)
# -XX:+UseG1GC: Garbage Collector G1 (melhor para heap < 2GB)
# -XX:MaxGCPauseMillis=200: Pausa GC < 200ms (mantém latência baixa)
# -XX:+HeapDumpOnOutOfMemoryError: Dump heap se OOM (debug)
# -XX:HeapDumpPath=/tmp: Local do dump
ENTRYPOINT ["java", \
    "-Xms512m", \
    "-Xmx1024m", \
    "-XX:MaxMetaspaceSize=256m", \
    "-XX:+UseG1GC", \
    "-XX:MaxGCPauseMillis=200", \
    "-XX:+HeapDumpOnOutOfMemoryError", \
    "-XX:HeapDumpPath=/tmp", \
    "-jar", "app.jar"]
# Modified: 2025-10-17 | FASE 1: Proteção OOM + Performance tuning
