// Constants
const path = require("path");
const bcrypt = require('bcryptjs');

const root = path.resolve(path.dirname(""));

const logHandler = require(`${root}/Util/loghandler.js`);
const jwthandler = require(`${root}/Util/jwthandler.js`);
const DB = require(`${root}/Util/dbhandler.js`);

const logindb = new DB("loginDB");

// Functions
function invoke(socket) {
  socket.on("getUserInfo", (data) => {
    var [header, payload, signature] = data.jwt.split(".");

    if (jwthandler.verifyJWT(data.jwt)) {

      payload = JSON.parse(jwthandler.base64toString(payload));
      socket.emit("getUserInfo", {username : payload.username});
    } else {
      socket.emit("getUserInfo", {response : "Invalid token.", error : 4});
    }
  });
}

module.exports.invoke = invoke;