// Constants
const path = require("path");
const fs = require("fs");
const process = require("process");

const root = path.resolve(path.dirname(""));
const logDir = `${root}/Logs`;

// Variables
var currentLogs = {};

// Functions
function getTimeStamp() {
  const d = new Date();
  const dateString = d.toLocaleString('en-US', { timeZone: 'America/New_York' });

  return `${dateString.split(" ")[1]} ${dateString.split(" ")[2]} EST`;
}

function startLogging(dir) {

  const d = new Date();
  const logName = d.toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/,/g, "").replace(/\//g, "\u2215");

  fs.writeFileSync(`Logs/${dir}/${logName}.txt`, `Log Started. (${getTimeStamp()})\n`);

  currentLogs[dir] = logName;
};

function log(data, dir) {

  if (currentLogs[dir]) {
    fs.appendFileSync(`Logs/${dir}/${currentLogs[dir]}.txt`, `${data} (${getTimeStamp()})\n`);
  }
}

module.exports.startLogging = startLogging;
module.exports.log = log;