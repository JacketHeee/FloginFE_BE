# ===== Build Stage =====
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean install -DskipTests

# ===== Runtime Stage =====
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache ca-certificates
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
# Set default port (Render will override with PORT=10000)
ENV PORT=8081
ENTRYPOINT ["java", "-jar", "app.jar"]
