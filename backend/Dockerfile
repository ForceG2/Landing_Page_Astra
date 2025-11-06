# Usa uma imagem base com Java 21
FROM eclipse-temurin:21-jdk

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Compila o projeto (Maven)
RUN ./mvnw clean package -DskipTests

# Expõe a porta (Render usa variável PORT automaticamente)
EXPOSE 8080

# Comando para iniciar o app
CMD ["sh", "-c", "java -jar target/*.jar --server.port=$PORT"]
