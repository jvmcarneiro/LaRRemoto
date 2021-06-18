# lar-remoto

Projeto do website para acesso aos conteúdos e ferramentas do Laboratório de
Robótica (LaR) da Escola Politécnica da UFBA.

Este repositório contém o código fonte do site a ser hospedado em um servidor
do laboratório, com o acesso dos estudantes e pesquisadores aos arquivos e
programas locais do LaR feito remotamente por VNC, via Apache Guacamole,
diretamente pelo website.

Abaixo estão as instruções de instalação básica para criação do site e servidor
Guacamole a serem rodados apenas localmente, sem grandes requisitos de
segurança. As instruções foram desenvolvidas com Ubuntu Linux em mente.

## Screenshots 
Tela inicial do site:
![Tela Inicial do site.](screenshots/lar-inicio.jpg?raw=true "Tela Inicial do site.")

Autenticação Guacamole:
![Autenticação Guacamole.](screenshots/guacamole-login.jpg?raw=true "Autenticação Guacamole.")

Conexões disponíveis no Guacamole:
![Conexões disponíveis no Guacamole.](screenshots/guacamole-connections.jpg?raw=true "Conexões disponíveis no Guacamole.")

Exemplo de sessão remota:
![Exemplo de sessão remota.](screenshots/guacamole-session.jpg?raw=true "Exemplo de sessão remota.")

## Pré-requisitos

Seguir os métodos de instalação recomendados para seu ambiente das seguintes
ferramentas:

- Docker Engine
- NPM

Todas as instruções abaixo supõem execução dentro de cópia local do repositório.
Para clonar e mudar o diretório:

```bash
git clone https://github.com/jvmcarneiro/lar-remoto
cd lar-remoto
```

## Instalação do Servidor Guacamole

É possível alterar as configurações do Guacamole nos arquivos da pastas `conf/`
(habilitar SSL, por exemplo) e do site na pasta `src/`.

1. Prototipar site com:

    ```bash
    npm install
    npm run build
    ```

2. Iniciar guacd daemon:

    ```bash
    docker run --name guacd \
      -v /home/mark1/Videos/guacamole:/record:rw \
      -d guacamole/guacd
    ```

3. Criar database MySQL (alterando senha de escolha):

    ```bash
    docker run --name mysql \
      -v "$(pwd)"/conf/mysql/initdb.sql:/docker-entrypoint-initdb.d/initdb.sql \
      -e MYSQL_ROOT_PASSWORD=root_password  \
      -e MYSQL_DATABASE=guacamole_db        \
      -e MYSQL_USER=guacamole_user          \
      -e MYSQL_PASSWORD=guacamole_password  \
      -d mysql
    ```

4. Modificar o valor do campo `server_name` no arquivo
   `conf/nginx/nginx.conf` com o endereço do servidor de acesso.

5. Iniciar Nginx com config local:

    ```bash
    docker run --name nginx \
        -v "$(pwd)"/conf/nginx/nginx.conf:/etc/nginx/nginx.conf \
        -v "$(pwd)"/build:/etc/nginx/build \
        -d -p 80:80 nginx
    ```

6. Caso deseje, alterar configurações padrão do guacamole e mysql via arquivo
   `conf/guacamole/guacamole.properties` segundo [Capítulos 5 e 6 do Guacamole
   Manual](http://guacamole.incubator.apache.org/doc/gug/index.html).

7. Iniciar container do servidor Guacamole (usando mesma senha usada na criação
   da database):

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

8. Habilitar serviços Docker (podem já estar habilitados por padrão):

    ```bash
    sudo systemctl enable docker.service
    sudo systemctl enable containerd.service
    ```

9. Mudar a senha padrão no Guacamole a partir do endereço definido no passo 3.


## Instalação e configuração do servidor VNC

Seguindo as recomendações na seção _Which VNC server?_ do [Capítulo 5 do
Guacamole Manual](https://guacamole.apache.org/doc/gug/configuring-guacamole.html),
escolha um servidor compatível com seu ambiente. Optamos pelo TigerVNC no
Ubuntu 16.04 utilizando as referências [Install tigervnc on
Ubuntu](https://gist.github.com/plembo/87a429f3bd1f95d4ec59b2ce8ce0a04d) e
[TigerVNC - Arch Wiki](https://wiki.archlinux.org/index.php/TigerVNC) com
conexão feita por Xvnc e XDMCP através dos seguintes passos:

1. Baixar os binários TigerVNC pela [release
   page](https://github.com/TigerVNC/tigervnc/releases) e extrair arquivos com:

    ```bash
    tar xzf tigervnc-*.tar.gz
    ```

2. Alterar permissões:

    ```bash
    cd tigervnc-*
    sudo chown -R root:root usr
    ```

3. Copiar binários para as pastas do sistema:

    ```bash
    sudo tar czf usr.tgz usr
    sudo tar xzkf usr.tgz -C /
    ```

4. Instalar o ambiente gráfico de escolha (optamos por XFCE, instalando com
   `sudo apt install xfce4 xfce4-goodies`).

5. Criar e configurar usuários linux, com ferramentas e permissões desejadas, para
   serem acessadas remotamente.

6. Habilitar XDMCP incluindo as linhas abaixo no arquivo de configuração do
   display manager de seu sistema (por padrão `/etc/lightdm/lightdm.conf` no
   Ubuntu):

    ```bash
    [XDMCPServer]
    enabled=true
    port=177
    ```

   E caso o servidor seja headless (sem interface gráfica) incluir também:

    ```bash
    [LightDM]
    start-default-seat=false
    ```

7. Reiniciar o display manager para carregar as novas configurações. No Ubuntu
   com LightDM:

    ```bash
    sudo service lightdm restart
    ```

8. Criar o arquivo `/etc/systemd/system/xvnc.socket` com o conteúdo:

    ```bash
    [Unit]
    Description=XVNC Server
    
    [Socket]
    ListenStream=5900
    Accept=yes
    
    [Install]
    WantedBy=sockets.target
    ```

9. Criar também `/etc/systemd/system/xvnc@.service` com:

    ```bash
    [Unit]
    Description=XVNC Per-Connection Daemon
    
    [Service]
    ExecStart=-/usr/bin/Xvnc -inetd -query localhost -geometry 1920x1080 -once -SecurityTypes=None
    User=nobody
    StandardInput=socket
    StandardError=syslog
    ```

10. Iniciar e habilitar o servidor VNC com:

    ```bash
    sudo systemctl start xvnc.socket
    sudo systemctl enable xvnc.socket
    ```

11. Criar conexões e usuários do Guacamole via *[ENDEREÇO DO
    SITE]/guacamole/* implementado anteriormente. Para configuração mínima
    de conexão, basta preencher os campos _Hostname_ (endereço de onde o
    servidor VNC está hospedado) e porta (5900 é a porta padrão VNC,
    configurada no passo 8).

## Solução de problemas

Erros ao tentar acessar a tela de login do Guacamole podem ocorrer caso os IPs
dos containers Docker estejam errados nos arquivos de configuração.  Os
arquivos `conf/nginx/nginx.conf` e `conf/tomcat/server.xml` assumem os IPs dos
containers `guacamole` e `nginx`, respectivamente, de acordo com a ordem em que cada um é iniciado. Caso esteja havendo algum conflito,
basta alterar os IPs nesses arquivos e reiniciar os containers.

Para averiguar os devidos IPs basta rodar o comando abaixo, substituindo o
container desejado ao final:

```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx
```

## Marcos do projeto

- [x] Refazer README
- [x] Configurar servidor proxy reverso
- [x] Alterar configurações padrão Guacamole
- [x] Consertar vulnerabilidades nas dependências do projeto
- [x] Remover oauth (autenticar somente pelo Guacamole)
- [x] Criar link para a página de login do Guacamole
- [x] Incluir configuração do servidor VNC
- [x] Testar e incluir instruções para VNC por XDMCP
