const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY = crypto.randomBytes(32); // store securely in real usage

function encryptData(data) {
  // Works for strings, arrays, objects, numbers, nested structures — anything JSON-serializable
  const text = JSON.stringify(data);

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

function decryptData({ encrypted, iv, authTag }) {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted); // parse back into original type
}

module.exports = {
    encryptData,
    decryptData
};