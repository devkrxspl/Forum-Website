// Constants
const path = require("path");
const bcrypt = require('bcryptjs');

const root = path.resolve(path.dirname(""));

const logHandler = require(`${root}/Util/loghandler.js`);
const jwthandler = require(`${root}/Util/jwthandler.js`);
const DB = require(`${root}/Util/dbhandler.js`);

const logindb = new DB("loginDB");

// Variables
var lastAccessed = {};

// Functions
function getMilliseconds() {
  return (new Date()).getTime();
}

function invoke(socket) {
  socket.on("login", (data) => {

    // Ratelimit of 200ms
    if (!lastAccessed[socket.id] || getMilliseconds() - lastAccessed[socket.id] >= 200) {

      const username = data.username;
      const password = data.password;

    
      // Checking if username and password are not null
      if (username && password) {
        
        logHandler.log("Authentication", `Login attempt made by user '${username}' (\\timestamp\\)`);

        // DB needs async calls
        (async () => {

          const a = await logindb.contains(username);
          
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
              socket.emit("login", {"response" : "Login attempt successful.", jwt : jwthandler.generateJWT(username)});
            } else {

              logHandler.log("Authentication", `Login attempt by user '${username}' unsuccessful. (Invalid password) (\\timestamp\\)`);
              socket.emit("login", {"response" : "The password you entered is invalid.", error : 1});
            }
          } else {
            
            logHandler.log("Authentication", `Invalid username '${username}' provided during login. (\\timestamp\\)`);
            socket.emit("login", {"response" : "Username does not exist.", error : 2});
          }
        })();
      } else {

        // Logging error 
        logHandler.log("Authentication", "Username or password not provided in login attempt. (\\timestamp\\)");
        socket.emit("login", {"response" : "Username or password not provided in login attempt.", error : 3});
      }
    }

    lastAccessed[socket.id] = getMilliseconds();
  });
}

module.exports.invoke = invoke;