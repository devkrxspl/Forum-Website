// Constants
const path = require("path");
const bcrypt = require('bcryptjs');

const root = path.resolve(path.dirname(""));

const logHandler = require(`${root}/Util/loghandler.js`);
const DB = require(`${root}/Util/dbhandler.js`);

const logindb = new DB("loginDB");

// Functions
function invoke(socket) {
  socket.on("login", (data) => {

    const username = data.username;
    const password = data.password;

    // Checking if username and password are not null
    if (username && password) {
      
      logHandler.log("Authentication", `Login attempt made. (\\timestamp\\)\nUsername: ${username}\nPassword: ${password}`);

      // DB needs async calls
      (async () => {

        if (await logindb.contains(username)) {

        } else {
          logHandler.log("Authentication", `Invalid username '${username}' provided during login. (\\timestamp\\)`);
        }
      })();
    } else {

      // Logging error 
      logHandler.log("Authentication", "Username or password not provided in login attempt. (\\timestamp\\)");
    }
  });
}

module.exports.invoke = invoke;