FROM openjdk:17-jdk-slim

# Directorio de trabajo
WORKDIR /app

# Copia el ejecutable JAR
# Asumiendo que el build genera el artefacto en target/TestBackendDevsu-0.0.1-SNAPSHOT.jar
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Expone el puerto configurado en application.yml
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]