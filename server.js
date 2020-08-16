#!/usr/bin/env node

const GuacamoleLite = require("guacamole-lite");
const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 8081;
const server = https.createServer(
  {
    key: fs.readFileSync("./privkey.pem"),
    cert: fs.readFileSync("./cert.pem"),
  },
  app
);

const websocketOptions = {
  port: PORT, // we will accept connections to this port
};

const guacdOptions = {
  port: 4822, // port of guacd
  host: "127.0.0.1",
};

const clientOptions = {
  crypt: {
    cypher: "AES-256-CBC",
    key: "MySuperSecretKeyForParamsToken12",
  },
  log: {
    level: "DEBUG",
    stdLog: (...args) => {
      console.log("[DEBUG]", ...args);
    },
    errorLog: (...args) => {
      console.error("[ERROR]", ...args);
    },
  },
};

// const guacServer = new GuacamoleLite(websocketOptions, guacdOptions, clientOptions);
const guacServer = new GuacamoleLite({ server }, guacdOptions, clientOptions);
server.listen(PORT);