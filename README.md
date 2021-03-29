# LaRRemoto
Projeto do website para acesso aos conteúdos e servidores do Laboratorio
Robótica - LaR da Escola Politécnica da UFBA.

O servidor de experimentos é configurado para ser acessado remotamente via
Apache Guacamole por VNC.

## Pré-requesitos
Seguir os métodos de instalação recomendados para seu ambiente dos seguintes
programas:
- Docker Engine
- Openssl
- NPM

## Instalação
A partir do diretório raiz do repositório:
1. Iniciar guacd daemon: `docker run --name guacd -d guacamole/guacd`
2. Criar database MySQL:
```bash
docker run --name mysql \
    -v $PWD/conf/mysql/initdb.sql:/docker-entrypoint-initdb.d/initdb.sql \
    -e MYSQL_ROOT_PASSWORD=root_password  \
    -e MYSQL_DATABASE=guacamole_db        \
    -e MYSQL_USER=guacamole_user          \
    -e MYSQL_PASSWORD=guacamole_password  \
    -d mysql
```
3. Substituir o valor do campo `server_name` no arquivo
   `./conf/nginx/nginx.conf` pelo endereço do servidor de acesso
4. Gerar certificado e chave com:
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./conf/nginx/private/nginx-selfsigned.key -out ./conf/nginx/certs/nginx-selfsigned.crt
```
5. Gerar grupo Diffie-Hellman para segurança na troca de chaves:
```bash
sudo openssl dhparam -out ./conf/nginx/certs/dhparam.pem 2048
```
6. Iniciar Nginx com certificados e config locais:
```bash
docker run --name nginx \
    -v $PWD/conf/nginx/nginx.conf:/etc/nginx/nginx.conf \
    -v $PWD/conf/nginx/ssl-redirect.conf:/etc/nginx/default.d/ssl-redirect.conf \
    -v $PWD/conf/nginx/certs/dhparam.pem:/etc/ssl/certs/dhparam.pem \
    -v $PWD/conf/nginx/certs/nginx-selfsigned.crt:/etc/ssl/certs/nginx-selfsigned.crt \
    -v $PWD/conf/nginx/private/nginx-selfsigned.key:/etc/ssl/private/nginx-selfsigned.key \
    -d -p 443:443 nginx
```
7. Iniciar container Guacamole:
```bash
docker run --name guacamole \
    -v $PWD/conf/tomcat/server.xml:/usr/local/tomcat/conf/server.xml \
    --link guacd:guacd                   \
    --link mysql:mysql                   \
    -e MYSQL_DATABASE=guacamole_db       \
    -e MYSQL_USER=guacamole_user         \
    -e MYSQL_PASSWORD=guacamole_password \
    -d -p 8080:8080 guacamole/guacamole
```
8. Executar a linha de comando "npm install"
9. Executar a linha de comando "npm start"

## Solução de problemas
Erros ao tentar acessar a tela de login do Guacamole podem ocorrer caso os IPs
dos containers estejam errados nos arquivos de configuração.  Os arquivos
`./conf/nginx/nginx.conf` e `./conf/tomcat/server.xml` assumem os IPs dos
containers `guacamole` e `nginx`, respectivamente, de acordo com sua ordem de
inicialização, e podem ser diferentes em outros ambientes.  Para averiguar os
devidos IPs basta rodar o comando abaixo, substuindo o container desejado ao
final:
```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx
```
Encontrados os IPs, basta substituir nos arquivos correspondentes indicados com
comentário, e reiniciar os containers com `docker restart nginx` Para ver o
exemplo do Apache-Guacamole funcionando
