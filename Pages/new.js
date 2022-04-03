// Constants
const path = require("path");
const root = path.resolve(path.dirname(""));

const logHandler = require(`${root}/Util/loghandler.js`);

// Functions
function invoke(req, res) {

  if (req.method == "GET") {
    
    res.sendFile(`${root}/Public/HTML/new.html`);
    
  }
}

// Main
module.exports.invoke = invoke;