// Constants
const path = require("path");
const bcrypt = require('bcryptjs');

const root = path.resolve(path.dirname(""));

const logHandler = require(`${root}/Util/loghandler.js`);
const jwthandler = require(`${root}/Util/jwthandler.js`);
const DB = require(`${root}/Util/dbhandler.js`);

const logindb = new DB("loginDB");
const draftdb = new DB("draftDB");

// Variables
var lastAccessed = {};

// Functions
function getMilliseconds() {
  return (new Date()).getTime();
}

function invoke(socket) {
  socket.on("autosave", (data) => {

    // Ratelimit of 200ms
    if (!lastAccessed[socket.id] || getMilliseconds() - lastAccessed[socket.id] >= 200) {
      
      const jwt = data.jwt;

      if (jwt && jwthandler.verifyJWT(jwt)) {
        
        // Handle retrieving/saving drafts
        socket.emit("autosave", {"response" : "Autosave successful."});
      } else {
        socket.emit("autosave", {response : "Invalid Token.", error : 4});
      }
    }

    lastAccessed[socket.id] = getMilliseconds();
  });
}

module.exports.invoke = invoke;