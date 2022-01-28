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
      
      logHandler.log("Authentication", `Login attempt made by user '${username}' (\\timestamp\\)`);

      // DB needs async calls
      (async () => {
        
        // Checking if username exists
        if (await logindb.contains(username)) {
          
          // Getting user credentials 
          const userCredentials = (await logindb.raw())[username];
          const hashedPassword = userCredentials.password;
          const salt = userCredentials.salt; 

          // Hashing given password
          const userHashedPassword = await bcrypt.hash(password, salt);
          
          // Checking if the user's hashed password matches the stored one
          if (userHashedPassword == hashedPassword) {
            
            logHandler.log("Authentication", `Login attempt by user '${username}' successful. (\\timestamp\\)`);
          } else {

            logHandler.log("Authentication", `Login attempt by user '${username}' unsuccessful. (\\timestamp\\)`);
          }
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