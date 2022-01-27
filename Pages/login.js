// POST handling Deprecated in favor of socket.io emit 
// to send credentials from the client.

// Constants
const path = require("path");
const root = path.resolve(path.dirname(""));

const logHandler = require(`${root}/Util/loghandler.js`);

// Functions
function invoke(req, res) {

  if (req.method == "GET") {
    
    res.sendFile(`${root}/Public/HTML/login.html`);
    
  } else if (req.method == "POST") {
    
    // const username = req.body.username;
    // const password = req.body.password;

    // // Checking if username and password are not null
    // if (username && password) {
      
    //   logHandler.log("Authentication", `Login attempt made.`);
    // } else {

    //   // Logging error 
    //   logHandler.log("Error", "Username or password not provided in login attempt.");
    // }
  }
}

// Main
module.exports.invoke = invoke;