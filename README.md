# lar-remoto

Project for a web page that provides remote access to the contents and tools present at the Robotics Lab (LaR) of the UFBA.

This repository contains the source code of a website-based tool to be hosted on a server
in the laboratory, providing access for students and researchers to remote archives and
tools via the Apache Guacamole framework with VNC.

User manuals for the tools provided in the project are present
in the `manual/` folder.

Following are the basic installation instructions for configuring and deploying the website and Guacamole server
to be made available ideally only on private networks, since the product has not been tested nor prepared for public network use. The instructions were developed taking Ubuntu Linux systems into consideration.

## Related repositories
- Virtual GUI for FPGA control: <https://github.com/jvmcarneiro/de2-115-virtual-input>
- Remote desktop configuration: <https://github.com/jvmcarneiro/largrad-setup>

## Screenshots 
Website home page:
![Website home page.](screenshots/lar-inicio.jpg?raw=true "Website home page.")

Example of a remote session within the web browser:
![Example of a remote session.](screenshots/guacamole-session.jpg?raw=true "Example of a remote session.")

## Prerequisites

Follow the recommended installation methods for these
tools on your specific environment:

- Docker Engine
- NPM

All the following instructions assume execution from within the local copy of the repository.
To clone and change directory:

```bash
git clone https://github.com/jvmcarneiro/lar-remoto
cd lar-remoto
```

## Guacamole server installation

It is possible to change Guacamole's settings through files in the `conf/` folder
(in order to enable SSL, for example) and also the website settings in the `src/` folder.

1. Prototype website with:

    ```bash
    npm install
    npm run build
    ```

2. Start guacd daemon:

    ```bash
    docker run --name guacd \
      -v /home/mark1/Videos/guacamole:/record:rw \
      --restart always      \
      -d guacamole/guacd 
    ```

3. Create MySQL database (picking password of choice):

    ```bash
    docker run --name mysql \
      -v "$(pwd)"/conf/mysql/initdb.sql:/docker-entrypoint-initdb.d/initdb.sql \
      -v "$(pwd)"/conf/mysql/database:/var/lib/mysql \
      -e MYSQL_ROOT_PASSWORD=root_password  \
      -e MYSQL_DATABASE=guacamole_db        \
      -e MYSQL_USER=guacamole_user          \
      -e MYSQL_PASSWORD=guacamole_password  \
      --restart always                      \
      -d -p 3306:3306 mysql
    ```

4. Modify the value of the field `server_name` with the access server address, in the
   `conf/nginx/nginx.conf` file.

5. Start Nginx with the local config files:

    ```bash
    docker run --name nginx \
        -v "$(pwd)"/conf/nginx/nginx.conf:/etc/nginx/nginx.conf \
        -v "$(pwd)"/build:/etc/nginx/build \
        --restart always    \
        -d -p 80:80 nginx
    ```
    
6. If desired, change the default Guacamole and MySQL settings via the
   `conf/guacamole/guacamole.properties` file, according to [Chapters 5 and 6 of the Guacamole
   Manual](http://guacamole.incubator.apache.org/doc/gug/index.html).

7. Start the Guacamole server container (using the same password inserted during the creation
   of the database):

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
      --restart always                     \
      -d guacamole/guacamole
    ```
    
8. Enable Docker services (may already be enabled by default):

    ```bash
    sudo systemctl enable docker.service
    sudo systemctl enable containerd.service
    ```

9. Change the default password in the Guacamole Settings page using the web address defined in step 3.

## Installation and configuration of the VNC server

Following the recommendations from the _Which VNC server?_ section of [Chapter 5 of the
Guacamole Manual](https://guacamole.apache.org/doc/gug/configuring-guacamole.html),
choose a server compatible with your environment. We opted for TigerVNC on
Ubuntu 16.04 using [Install tigervnc on
Ubuntu](https://gist.github.com/plembo/87a429f3bd1f95d4ec59b2ce8ce0a04d) and
[TigerVNC - Arch Wiki](https://wiki.archlinux.org/index.php/TigerVNC) as references, setting the connection
to use Xvnc and XDMCP through the following steps:

1. Download the TigerVNC binaries from the [release
   page](https://github.com/TigerVNC/tigervnc/releases) and extract files with:

    ```bash
    tar xzf tigervnc-*.tar.gz
    ```

2. Change permissions:

    ```bash
    cd tigervnc-*
    sudo chown -R root:root usr
    ```

3. Copy binaries to system folders:

    ```bash
    sudo tar czf usr.tgz usr
    sudo tar xzkf usr.tgz -C /
    ```
    
4. Install the desktop environment of choice (we opted for XFCE, installing with
   `sudo apt install xfce4 xfce4-goodies`).

5. Create and configure linux users, with the desired tools and permissions, to
   be accessed remotely.

6. Enable XDMCP by including the following lines to the config file
   of your system's display manager (by default `/etc/lightdm/lightdm.conf` in
   Ubuntu):

    ```bash
    [XDMCPServer]
    enabled=true
    port=177
    ```

   And if the server is headless (without a graphical interface), also include:

    ```bash
    [LightDM]
    start-default-seat=false
    ```

7. Restart the display manager to load the new settings. On Ubuntu
   with LightDM:

    ```bash
    sudo service lightdm restart
    ```

8. Create the `/etc/systemd/system/xvnc.socket` file with the following contents:

    ```bash
    [Unit]
    Description=XVNC Server
    
    [Socket]
    ListenStream=5900
    Accept=yes
    
    [Install]
    WantedBy=sockets.target
    ```
    
9. Also create `/etc/systemd/system/xvnc@.service` containing:

    ```bash
    [Unit]
    Description=XVNC Per-Connection Daemon
    
    [Service]
    ExecStart=-/usr/bin/Xvnc -inetd -query localhost -geometry 1920x1080 -once -SecurityTypes=None
    User=nobody
    StandardInput=socket
    StandardError=syslog
    ```
    
10. Start and enable the VNC server with:

    ```bash
    sudo systemctl start xvnc.socket
    sudo systemctl enable xvnc.socket
    ```

11. Create Guacamole connections and users via *[WEB ADDRESS]/guacamole/* implemented earlier. For a minimal configuration
    connection, just fill in the _Hostname_ fields (address where the
    VNC server is hosted) and port (5900 is the default VNC port,
    configured in step 8).
    

## Troubleshooting

Errors while trying to access the Guacamole login screen can occur if the IPs
of the Docker containers do not match the ones in the project's configuration files. The
`conf/nginx/nginx.conf` and `conf/tomcat/server.xml` files assume the IP addresses of the
`guacamole` and `nginx` containers, respectively, according to the order in which they start. If there is a conflict,
try checking and changing the IPs in these files and then restarting the containers.

To check the proper IP addressses just run the following command, replacing the
desired container at the end:

```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx
```
