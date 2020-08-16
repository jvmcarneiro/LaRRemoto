# LabVirtualRemoto
Laboratorio Virtual de Robotica - TCC

## Pre-requesitos
1. Docker instalado na maquina.

## Projeto do Laboratorio Virtual
1. Executar a linha de comando "docker run --name guacd -d guacamole/guacd"
2. Executar a linha de comando "docker run -e CRYPT_SECRET=senha -e GUACD_HOST=localhost -e GUACD_PORT=4822 -d -p 8080:8080 glokon/guacamole-lite-docker"

Verificar https://github.com/GLOKON/guacamole-lite-docker/ para mais opcoes
3. Executar a linha de comando "npm install"
4. Executar a linha de comando "npm start"

## Exemplo do Apache-Guacamole via Docker

Para ver o exemplo do Apache-Guacamole funcionando

1. Executar os comandos listados no arquivo Docker-Apache.txt
2. Conectar via http://localhost:8080/guacamole/
