import crypto from 'crypto';

// const crypto = require('crypto');

const clientOptions = {
  crypt: {
    cypher: 'AES-256-CBC',
    key: 'MySuperSecretKeyForParamsToken12',
  },

  log: {
    level: 'DEBUG',
  },

  connectionDefaultSettings: {
    rdp: {
      'create-drive-path': true,
      'ignore-cert': true,
      'enable-wallpaper': false,
      'create-recording-path': true,
    },
  },
};

const encrypt = (value) => {
  const iv = crypto.randomBytes(16);
  console.log(clientOptions);
  console.log(iv);
  const cipher = crypto.createCipheriv(clientOptions.crypt.cypher, clientOptions.crypt.key, iv);

  let crypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
  crypted += cipher.final('base64');

  const data = {
    iv: iv.toString('base64'),
    value: crypted,
  };

  return new Buffer.from(JSON.stringify(data).toString('base64'));
};

export default encrypt;