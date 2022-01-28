// Constants
const path = require("path");
const root = path.resolve(path.dirname(""));

const logHandler = require(`${root}/Util/loghandler.js`);

// Functions
function invoke(socket) {
  socket.on("login", (data) => {

    const username = data.username;
    const password = data.password;

    // Checking if username and password are not null
    if (username && password) {
      
      logHandler.log("Authentication", `Login attempt made by socket id ${socket.id}. (\\timestamp\\)\nUsername:${username}\nPassword:${password}`);
    } else {

      // Logging error 
      logHandler.log("Error", "Username or password not provided in login attempt.");
    }
  });
}

module.exports.invoke = invoke;