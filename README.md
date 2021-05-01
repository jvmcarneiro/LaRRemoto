# lar-remoto

Projeto do website para acesso aos conteúdos e ferramentas do Laboratório de
Robótica (LaR) da Escola Politécnica da UFBA.

Este repositório contém o código fonte do site a ser hospedado em um servidor
do laboratório, com o acesso dos estudantes e pesquisadores aos arquivos e
programas locais do LaR feito remotamente por VNC, via Apache Guacamole
diretamente pelo website.

Abaixo estão as instruções de instalação básica para criação do site e servidor
Guacamole, a serem rodados apenas localmente e sem grandes requisitos de
segurança.

## Pré-requisitos

Seguir os métodos de instalação recomendados para seu ambiente das seguintes
ferramentas:

- Docker Engine
- Docker Compose
- NPM

Todas as instruções abaixo supõem execução dentro de cópia local do repositório.
Para clonar e mudar o diretório:

```bash
git clone https://github.com/jvmcarneiro/lar-remoto ;
cd lar-remoto
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
   `conf/nginx/nginx.conf` com o endereço do servidor de acesso.

4. Iniciar Nginx com config local:

    ```bash
    docker run --name nginx \
        -v "$(pwd)"/conf/nginx/nginx.conf:/etc/nginx/nginx.conf \
        -d -p 80:80 nginx
    ```

5. Caso deseje, alterar configurações padrão do guacamole e mysql via arquivo
   `conf/guacamole/guacamole.properties` segundo [Capítulos 5 e 6 do Guacamole
   Manual](http://guacamole.incubator.apache.org/doc/gug/index.html).

6. Iniciar container do servidor Guacamole (usando mesma senha usada na criação
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

7. Mudar a senha padrão no guacamole a partir do endereço definido no passo 3.

## Deployment do site

O script `react-scripts build`, executado com `npm install; npm run build` na
pasta do repositório, já dá conta de todo processo de prototipagem, restando
apenas a configuração do servidor de acesso. A escolha de método de deploy
depende de critérios pessoais, mas abaixo seguem algumas recomendações:

Para instruções gerais de deploy pode ser consultado o [Create React App
Deployment Guide](https://create-react-app.dev/docs/deployment/);

Para configuração de um servidor local, o guia [How To Deploy a React
Application with Nginx on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-react-application-with-nginx-on-ubuntu-20-04)
detalha todo o processo.

Através dessa última abordagem, é possível configurar o servidor nginx do site
utilizando o mesmo container docker que está servindo o guacamole, seguindo os
passos abaixo:

1. Prototipar o projeto com `npm install; npm run build`, criando a pasta
   `build/` que pode ser deixada na raiz do repositório.

2. Incluir em `conf/nginx/nginx.conf`, dentro do campo _server_, o parâmetro
   _root_ apontando para a localização da pasta `build/` dentro do container
   (localização definida no passo 4 a seguir) :

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
      -v "$(pwd)"/build:/etc/nginx/build \
      -d -p 80:80 nginx
    ```

Esses passos são suficientes para deploy em um servidor acessível apenas por
VPN, por exemplo, onde usuários sabem o IP local da máquina.

## Instalação e configuração do servidor VNC

Seguindo as recomendações na seção _Which VNC server?_ do [Capítulo 5 do
Guacamole Manual](https://guacamole.apache.org/doc/gug/configuring-guacamole.html),
escolha um servidor compatível com seu ambiente. Optamos pelo TigerVNC no
Ubuntu utilizando as referências [Install tigervnc on
Ubuntu](https://gist.github.com/plembo/87a429f3bd1f95d4ec59b2ce8ce0a04d) e
[TigerVNC - Arch Wiki](https://wiki.archlinux.org/index.php/TigerVNC) pelos
seguintes passos:

1. Baixar os binários TigerVNC pela [release
   page](https://github.com/TigerVNC/tigervnc/releases) e extrair arquivos com:

    ```bash
    tar xzf tigervnc-*.tar.gz
    ```

2. Alterar permissões:

    ```bash
    cd tigervnc-* ;
    sudo chown -R root:root usr
    ```

3. Copiar binários para as pastas do sistema:

    ```bash
    sudo tar czf usr.tgz usr ;
    sudo tar xzkf usr.tgz -C /
    ```

4. Instalar o ambiente gráfico de escolha (optamos por XFCE, instalando com
   `sudo apt install xfce4 xfce4-goodies`).

5. Criar e configurar usuários linux, com desktops e permissões desejados, para
   serem acessadas remotamente.

6. Criar o arquivo `~/.vnc/config` com configurações mínimas do servidor:

    ```bash
    session=xfce
    geometry=1920x1080
    alwaysshared
    ```

7. Criar senha do servidor VNC com o comando `vncpasswd` utilizando o usuário
   no qual deseja ser feita a conexão.

8. Incluir no arquivo `/usr/etc/tigervnc/vncserver.users` mapeamentos de
   usuários e portas VNC. Por exemplo, para incluir o usuário _fulano_ na porta
   5901 adicionamos a linha `:1=fulano`ao arquivo.

9. Iniciar e (opcionalmente) habilitar servidor para cada porta associada ao
   usuário desejado, segundo mapeamento no passo 8:

    ```bash
    sudo systemctl start vncserver@:1 ;
    sudo systemctl enable vncserver@:1
    ```

10. Configurar conexões e usuários via guacamole (instalado anteriormente).
    Para configuração mínima de conexão, basta preencher os campos _Hostname_
    (endereço do servidor VNC) e porta referente ao usuário desejado (5901 para
    _fulano_, segundo exemplo acima). A senha do servidor (gerada no passo 7)
    pode ser preenchida no campo _Authentication_ ou deixada em branco para ser
    requisitada toda vez que for feita uma conexão.

11. Repetir os passos 8 a 10 para cada nova sessão desejada, incluindo os
    passos 6 e 7 para usuários linux sem conexões prévias. Conexões distintas,
    mesmo que sobre um mesmo usuário linux, gerarão sessões distintas (cada
    conexão vê um desktop próprio). Porém, caso usuários guacamole acessem a
    mesma conexão, eles irão interagir entre si na mesma sessão (verão a mesma
    tela, por exemplo).

Uma configuração VNC com XDMCP cria sessões dinamicamente, e evitaria a
necessidade de criação antecipada de um serviço para cada sessão desejada. Essa
configuração, porém, ainda não foi testada no projeto.

## Solução de problemas

Erros ao tentar acessar a tela de login do Guacamole podem ocorrer caso os IPs
dos containers estejam errados nos arquivos de configuração.  Os arquivos
`conf/nginx/nginx.conf` e `conf/tomcat/server.xml` assumem os IPs dos
containers `guacamole` e `nginx`, respectivamente, de acordo com sua ordem de
inicialização, e podem ser diferentes em outros ambientes.

Para averiguar os devidos IPs basta rodar o comando abaixo, substituindo o
container desejado ao final:

```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx
```

Encontrados os IPs, basta substituir nos arquivos correspondentes indicados com
comentário, e reiniciar os containers com `docker restart nginx`.

## Marcos do projeto

- [x] Refazer README
- [x] Configurar servidor proxy reverso
- [x] Alterar configurações padrão Guacamole
- [x] Consertar vulnerabilidades nas dependências do projeto
- [x] Remover oauth (autenticar somente pelo guacamole)
- [x] Criar link para a página de login do Guacamole
- [x] Incluir configuração do servidor VNC
- [ ] Testar e incluir instruções para VNC por XDMCP
- [ ] Adaptar projeto para Docker Compose
