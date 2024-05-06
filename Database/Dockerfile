FROM mysql/mysql-server:latest

COPY ./01_create_user.sql /docker-entrypoint-initdb.d/
COPY ./02_create_database.sql /docker-entrypoint-initdb.d/