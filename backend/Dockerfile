# Giai đoạn Build - Sử dụng image Java 21 để build dự án
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Sao chép file POM để tải dependencies
COPY pom.xml .
RUN mvn dependency:go-offline
# Sao chép mã nguồn còn lại
COPY src ./src
# Build ứng dụng thành JAR
RUN mvn clean install -DskipTests

# Giai đoạn Runtime - Sử dụng image nhẹ hơn để chạy ứng dụng
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Sao chép file JAR đã build
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
# Môi trường cần thiết
ENV PORT 8080
# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]