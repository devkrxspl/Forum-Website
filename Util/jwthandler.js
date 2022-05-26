// Constants
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// Functions
function stringToBase64(string) {
  return Buffer.from(string).toString("base64");
}

function base64toString(base64) {
  return Buffer.from(base64, 'base64').toString();
}

function encrypt(string, key) {

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);

  return encrypted.toString('hex');
}

function decrypt(string, key) {

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(string, 'hex')), decipher.final()]);

  return decrypted.toString();
}

function verifyJWT(jwt) {

  const data = jwt.split(".");

  // Checking if encrypted b64 header + b64 payload matches signature
  return encrypt(data[0] + data[1], key) == data[2];
}

function generateJWT(username) {

  const header = {encryption : "SHA-256", type : "JWT"};
  const payload = {username : username};

  // Base 64 encoding header and payload
  const headerb64 = stringToBase64(JSON.stringify(header));
  const payloadb64 = stringToBase64(JSON.stringify(payload));

  // Concatenating b64 encoded header and payload and then encrypting them
  // to form signature
  const signature = encrypt(headerb64 + payloadb64, key);
  const jwt = headerb64 + "." + payloadb64 + "." + signature;

  return jwt;
}

// ONLY TO BE USED IF JWT IS VERIFIED
function getPayload(jwt) {

  const data = jwt.split(".");

  return base64toString(data[1]);
}

module.exports.generateJWT = generateJWT;
module.exports.verifyJWT = verifyJWT;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.stringToBase64 = stringToBase64;
module.exports.base64toString = base64toString
module.exports.getPayload = getPayload;