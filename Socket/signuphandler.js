// Constants
const path = require("path");
const bcrypt = require('bcryptjs');

const root = path.resolve(path.dirname(""));

const logHandler = require(`${root}/Util/loghandler.js`);
const DB = require(`${root}/Util/dbhandler.js`);

const logindb = new DB("loginDB");

// Variables
var lastAccessed = {};

// Functions
function getMilliseconds() {
  return (new Date()).getTime();
}

function invoke(socket) {
  socket.on("signup", (data) => {

    // Ratelimit of 200ms
    if (!lastAccessed[socket.id] || getMilliseconds() - lastAccessed[socket.id] >= 200) {

      const username = data.username;
      const password = data.password;

      // Checking if username and password are not null
      if (username && password) {
        
        logHandler.log("Authentication", `Signup attempt made using username '${username}'. (\\timestamp\\)`);

        // DB needs async calls
        (async () => {

          if (!await logindb.contains(username)) {

            // Hashing password 
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);

            // Storing credentials in database
            await logindb.set(username, {password : hash, salt : salt});

            // Logging success
            logHandler.log("Authentication", `Signup attempt by user '${username}' successful. (\\timestamp\\)`);
            socket.emit("signup", {"response" : `Signup attempt successful.`});

          } else {
            logHandler.log("Authentication", `Signup attempt failed; username '${username}' already exists. (\\timestamp\\)`);
            socket.emit("signup", {"response" : `Signup attempt failed; username already exists.`});
          }
        })();
      } else {

        // Logging error 
        logHandler.log("Authentication", "Username or password not provided in signup attempt. (\\timestamp\\)");
        socket.emit("signup", {"response" : "Username or password not provided in signup attempt."});
      }
    }

    lastAccessed[socket.id] = getMilliseconds();
  });
}

module.exports.invoke = invoke;