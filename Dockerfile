FROM oraclelinux:9 as build
LABEL authors="Tomiyoshi Hitaki"
WORKDIR /workspace/app
COPY ./ .
RUN  dnf module enable nodejs:20 -y && \
     dnf update -y && \
     dnf install -y java-21-openjdk-devel nodejs
RUN  ls -al && \
     cd app  && \
     npm install && \
     npm run build && \
     cd .. && \
     sh mvnw -B package --file pom.xml


FROM oraclelinux:9 as run
COPY --from=build /workspace/app/target/*.jar app.jar
# Install Redis
RUN dnf install -y redis java-21-openjdk
# Run Redis server in the background
RUN redis-server --port 6379 --daemonize yes --bind 127.0.0.1
# Expose the port for the Spring Boot application
#EXPOSE 8080
ENTRYPOINT ["sh", "-c", "redis-server --port 6379 --daemonize yes; java -jar /app.jar"]
