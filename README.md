# LaRRemoto
Projeto do website para acesso aos conteúdos e servidores do Laboratorio
Robótica - LaR da Escola Politécnica da UFBA.

O servidor de experimentos é configurado para ser acessado remotamente via
Apache Guacamole por VNC, utilizando servidor de proxy reverso Nginx.


## Pré-requesitos
Seguir os métodos de instalação recomendados para seu ambiente dos seguintes
programas:
- Docker Engine
- NPM
- Openssl (opcional)

Todas as instruções abaixo supõem execução dentro de cópia local do repositório. Para clonar e mudar o diretório:
```bash
git clone https://github.com/jvmcarneiro/LaRRemoto
cd LaRRemoto
```

## Instalação Servidor Guacamole
A partir do diretório raiz do repositório:

1. Iniciar guacd daemon:
```bash
docker run --name guacd -d guacamole/guacd
```

2. Criar database MySQL (alterando senha de escolha):
```bash
docker run --name mysql \
    -v "$(pwd)"/conf/mysql/initdb.sql:/docker-entrypoint-initdb.d/initdb.sql \
    -e MYSQL_ROOT_PASSWORD=root_password  \
    -e MYSQL_DATABASE=guacamole_db        \
    -e MYSQL_USER=guacamole_user          \
    -e MYSQL_PASSWORD=guacamole_password  \
    -d mysql
```

3. Modificar o valor do campo `server_name` no arquivo
   `conf/nginx/nginx.conf` com o endereço do servidor de acesso

4. Iniciar Nginx com config local:
```bash
docker run --name nginx \
    -v "$(pwd)"/conf/nginx/nginx.conf:/etc/nginx/nginx.conf \
    -d -p 80:80 nginx
```

5. Caso deseje, alterar configurações padrão do guacemole e mysql via arquivo `conf/guacamole/guacamole.properties` segundo [Capítulos 5 e 6 do Guacamole Manual](http://guacamole.incubator.apache.org/doc/gug/index.html)

6. Iniciar container Guacamole (usando mesma senha usada na criação da database):
```bash
docker run --name guacamole \
    -v "$(pwd)"/conf/tomcat/server.xml:/usr/local/tomcat/conf/server.xml \
    -v "$(pwd)"/conf/guacamole:/root/.custom_guacamole \
    --link guacd:guacd                   \
    --link mysql:mysql                   \
    -e MYSQL_DATABASE=guacamole_db       \
    -e MYSQL_USER=guacamole_user         \
    -e MYSQL_PASSWORD=guacamole_password \
    -e GUACAMOLE_HOME=/root/.custom_guacamole \
    -d guacamole/guacamole
```

7. Mudar senha do usuário guacadmin padrão (via interface web ou database) e criar conexões e usuários


## Deployment do site
O script `react-scripts build`, executado com `npm install; npm run build` na pasta do repositório, já dá conta de todo processo de prototipagem, restando apenas a configuração do servidor de acesso. A escolha de método de deploy depende de critérios pessoais, mas abaixo seguem algumas recomendações.

Para instruções gerais de deploy pode ser consultado o [Create React App Deployment Guide](https://create-react-app.dev/docs/deployment/);

Para configuração de um servidor local, o guia [How To Deploy a React Application with Nginx on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-react-application-with-nginx-on-ubuntu-20-04) instrui durante todo o processo.

Utilizando essa última abordagem, é possível configurar o servidor nginx utlizando o mesmo container docker que está servindo o guacamole. Para tal basta:

1. Prototipar o projeto com `npm install; npm run build`, criando a pasta `build/` que pode ser deixada na raiz do repositório mesmo

2. Incluir em `conf/nginx/nginx.conf` dentro do campo `server` o parâmetro `root` apontando para a localização da pasta `build/` dentro do container (definida no passo 4) :
```bash
root /etc/nginx/build;
index index.html index.htm;
```

3. Parar e remover o container nginx com:
```bash
docker stop nginx; docker rm nginx
```

4. Iniciar novamente o container nginx, incluindo volume com a pasta `build/`:
```bash
docker run --name nginx \
    -v "$(pwd)"/conf/nginx/nginx.conf:/etc/nginx/nginx.conf \
    -v "$(pwd)"/build:/etc/nginx/build
    -d -p 80:80 nginx
```

Esses passos são suficientes para deploy em um servidor acessível apenas por VPN, por exemplo, onde usuários sabem o IP local da máquina.


## Instalação e configuração do servidor VNC
Seguindo as recomendações na seção _Which VNC server?_ do [Capítulo 5 do Guacamole Manual](https://guacamole.apache.org/doc/gug/configuring-guacamole.html), escolha um servidor compatível com seu ambiente. Optamos pelo TigerVNC no Ubuntu seguindo os passos:

1. Instalar o TigerVNC (utilizamos os binários genéricos da [release page](https://github.com/TigerVNC/tigervnc/releases) com [este guia](https://gist.github.com/plembo/87a429f3bd1f95d4ec59b2ce8ce0a04d) de referência, mas fazendo a instalação em `/usr/` ao invés de `/usr/local/` e pulando os passos 12 e 13)

2. Instalar o ambiente gráfico de escolha (optamos por XFCE, instalando com `sudo apt install xfce4 xfce4-goodies`)

3. Criar e configurar contas usuário para serem acessadas remotamente (seguimos [esta solução para usuários restritos](https://access.redhat.com/solutions/65822))

4. Configurar o TigerVNC (seguimos [esta página da Arch Wiki](https://wiki.archlinux.org/index.php/TigerVNC), utilizando Xvnc para sessões sob demanda e adaptando algumas instruções para o Ubuntu)

5. Criar usuários, grupos e conexões correspondentes no Guacamole pela conta administradora (basta seguir o [Capítulo 17 do Guacamole Manual](https://guacamole.apache.org/doc/gug/administration.html))


## Habilitar SSL no Guacamole (opcional)
Os passos abaixo instruem sobre a criação de certificado e chave HTTPS locais (geram avisos nos browsers), mas caso já os possua basta substituí-los no passo 2.

1. Pare e remova o container nginx:
```bash
docker stop nginx; docker rm nginx
```

2. Gere certificado e chave com:
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout conf/nginx/nginx-selfsigned.key -out conf/nginx/nginx-selfsigned.crt
```

3. Gere grupo Diffie-Hellman para segurança na troca de chaves:
```bash
sudo openssl dhparam -out conf/nginx/dhparam.pem 2048
```

4. Caso necessário modifique o valor do campo `server_name` no arquivo
   `conf/nginx/nginx_ssl.conf` com o endereço do servidor de acesso

5. Inicie Nginx com certificados:
```bash
docker run --name nginx \
    -v "$(pwd)"/conf/nginx/nginx_ssl.conf:/etc/nginx/nginx.conf \
    -v "$(pwd)"/conf/nginx/ssl-redirect.conf:/etc/nginx/default.d/ssl-redirect.conf \
    -v "$(pwd)"/conf/nginx/dhparam.pem:/etc/ssl/certs/dhparam.pem \
    -v "$(pwd)"/conf/nginx/nginx-selfsigned.crt:/etc/ssl/certs/nginx-selfsigned.crt \
    -v "$(pwd)"/conf/nginx/nginx-selfsigned.key:/etc/ssl/private/nginx-selfsigned.key \
    -d -p 443:443 nginx
```

É possível habilitar SSL entre o cliente guacamole e o serviço guacd, criando o arquivo `/etc/guacamole/guacd.conf` no container guacd, incluindo também certificado e chave.
A database também pode ser configurada para utilizar SSL.
Instruções de configuração nos [Capítulos 5 e 6 do Guacamole Manual](http://guacamole.incubator.apache.org/doc/gug/index.html).


## Solução de problemas
Erros ao tentar acessar a tela de login do Guacamole podem ocorrer caso os IPs
dos containers estejam errados nos arquivos de configuração.  Os arquivos
`conf/nginx/nginx.conf` e `conf/tomcat/server.xml` assumem os IPs dos
containers `guacamole` e `nginx`, respectivamente, de acordo com sua ordem de
inicialização, e podem ser diferentes em outros ambientes.

Para averiguar os devidos IPs basta rodar o comando abaixo, substuindo o
container desejado ao final:
```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx
```
Encontrados os IPs, basta substituir nos arquivos correspondentes indicados com
comentário, e reiniciar os containers com `docker restart nginx`.


## A fazer
- [x] Refazer README
- [x] Configurar servidor proxy reverso
- [x] Alterar configurações padrão Guacamole
- [x] Consertar vulnerabilidades nas dependências do projeto
- [x] Remover oauth (autenticar somente pelo guacamole)
- [x] Criar link para a página de login do Guacamole
- [ ] Incluir instruções para servidor VNC
- [ ] Incluir requisitos para transferência de arquivos SFTP
- [ ] Configurar conexão e usuários VNC
- [ ] Preparar projeto para produção
- [ ] Adaptar projeto para Docker Compose

