# Builder: Maven + Temurin 21 (Alpine)
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy parent pom
COPY pom.xml .

# Copy modules
COPY core-module/ ./core-module/
COPY financial-module/ ./financial-module/

# Build application
RUN mvn -B -DskipTests clean package

# Runtime: Temurin 21 JRE (Alpine)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl

# Copy JAR from core-module
COPY --from=builder /app/core-module/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
