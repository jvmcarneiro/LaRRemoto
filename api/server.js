'use strict';

const GuacamoleLite = require('guacamole-lite');

const PORT = 8080;
const CRYPT_SECRET = process.env.CRYPT_SECRET;
const CRYPT_CYPHER = process.env.CRYPT_CYPHER || 'AES-256-CBC';
const GUACD_HOST = process.env.GUACD_HOST || '127.0.0.1';
const GUACD_PORT = process.env.GUACD_PORT || 4822;

function start(cryptKey, cryptCypher , websocketPort , guacdHost, guacdPort) {
    if (!cryptKey || cryptKey.length === 0) {
        console.error('[GUACAMOLE] No secret key specified, please specify a key with CRYPT_SECRET environment variable');
        return;
    }

    const websocketOptions = {
        port: websocketPort
    };

    const guacdOptions = {
        host: guacdHost,
        port: guacdPort,
    };

    const clientOptions = {
        crypt: {
            cypher: cryptCypher,
            key: cryptKey
        }
    };

    console.info('[GUACAMOLE] Starting Server');
    console.info('[GUACAMOLE] WebSocket on ws://0.0.0.0:' + websocketPort);
    console.info('[GUACAMOLE] GuacD host on ' + guacdHost + ':' + guacdPort);
    return new GuacamoleLite(websocketOptions, guacdOptions, clientOptions);
}

const server = start(CRYPT_SECRET, CRYPT_CYPHER, PORT, GUACD_HOST, GUACD_PORT);
console.info('[GUACAMOLE] WebSocket Tunnel running on ws://0.0.0.0:' + PORT);