# Etapa de build
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copia o backend para dentro do container
COPY . .

# Dá permissão de execução ao Maven Wrapper
RUN chmod +x mvnw

# Compila o projeto (sem rodar testes)
RUN ./mvnw clean package -DskipTests

# Etapa final (somente runtime)
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copia o .jar gerado da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Render usa a variável de ambiente PORT automaticamente
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["java", "-jar", "app.jar"]
