// Constants
const path = require("path");
const root = path.resolve(path.dirname(""));

// Functions
function invoke(req, res) {

  if (req.method == "GET") {
    
    res.sendFile(`${root}/Public/HTML/login.html`);
    
  } else if (req.method == "POST") {
    
    console.log(req.body);
  }
}

// Main
module.exports.invoke = invoke;