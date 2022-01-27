  // Constants
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const fs = require("fs");
const bodyParser = require('body-parser');

const root = path.resolve(path.dirname(""));

const logHandler = require(`${root}/Util/loghandler.js`);

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(root + '/Public'));
app.use(express.json());

// Socket router
io.on("connection", (socket) => {

  fs.readdirSync(`${root}/Socket`).forEach( (filename) => {
    require(`${root}/Socket/${filename}`).invoke(socket);
  });
});

// Main
app.get("/", (req, res) => {
  res.sendFile(`${root}/Public/HTML/index.html`);
});

// Page routing
fs.readdirSync(`${root}/Pages`).forEach( (filename) => {

  app.all(`/${filename.split(".")[0]}`, urlencodedParser, (req, res) => {
    require(`${root}/Pages/${filename}`).invoke(req, res);
  });
});

// Error handling
app.use((error, req, res, next) => {
  logHandler.log(error, "Error");
});

logHandler.startLogging("Error");
server.listen(3001);
console.log();