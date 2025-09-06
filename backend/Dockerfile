# Builder: Maven + Temurin 17 (Alpine)
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests clean package

# Runtime: Temurin 17 JRE (Alpine)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
# O comando/entrypoint será fornecido pelo docker-compose (override)
