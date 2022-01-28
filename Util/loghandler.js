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

  // Get current date in string form
  const d = new Date();
  const dateString = d.toLocaleString('en-US', { timeZone: 'America/New_York' });

  return `${dateString.split(" ")[1]} ${dateString.split(" ")[2]} EST`;
}

function startLogging(dir) {

  // Get current date in string form
  // Remove comma and replace slashes with unicode version
  // to avoid conflict with fs (slashes cause an error when calling writeFileSync)
  const d = new Date();
  const logName = d.toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/,/g, "").replace(/\//g, "\u2215");

  fs.writeFileSync(`Logs/${dir}/${logName}.txt`, `Log Started. (${getTimeStamp()})\n`);

  currentLogs[dir] = logName;
};

function log(dir, data) {

  // If directory exists, add line to log
  if (currentLogs[dir]) {
    fs.appendFileSync(`Logs/${dir}/${currentLogs[dir]}.txt`, `${data.replace("\\timestamp\\", getTimeStamp())}\n`);
  }
}

function clearLogs(dir) {

  // Iterating through all the logs of the specified
  // directory and deleting them
  fs.readdirSync(`${logDir}/${dir}`).forEach( (filename) => {
    fs.unlinkSync(`${logDir}/${dir}/${filename}`);
  });
}

module.exports.startLogging = startLogging;
module.exports.clearLogs = clearLogs;
module.exports.log = log;