// Constants
const path = require("path");
const fs = require("fs");
const process = require("process");

const root = path.resolve(path.dirname(""));
const logDir = `${root}/Logs`;

// Variables
var currentLog;

// Functions
function getTimeStamp() {
  const d = new Date();
  const dateString = d.toLocaleString('en-US', { timeZone: 'America/New_York' });

  return `${dateString.split(" ")[1]} ${dateString.split(" ")[2]} EST`;
}

function startLogging() {

  const d = new Date();
  const logName = d.toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/,/g, "").replace(/\//g, "\u2215");

  fs.writeFileSync(`Logs/${logName}.txt`, `Log Started. (${getTimeStamp()})\n`);

  currentLog = logName;
};

function log(data) {

  if (currentLog) {
    fs.appendFileSync(`Logs/${currentLog}.txt`, `${data} (${getTimeStamp()})\n`);
  }
}

module.exports.startLogging = startLogging;
module.exports.log = log;