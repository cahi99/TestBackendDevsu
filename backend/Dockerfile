# Etapa 1: Construcción (Build)
# Usamos una imagen de maven que soporta múltiples arquitecturas (incluyendo Apple Silicon M1/M2/M3)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos el pom.xml y descargamos dependencias primero (aprovecha el caché de Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución (Run)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copiamos el JAR generado desde la etapa de construcción anterior
COPY --from=build /app/target/*.jar app.jar

# Copiamos el script de la base de datos para que Spring Boot lo encuentre
COPY BaseDatos.sql .

# Exponemos el puerto de la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]