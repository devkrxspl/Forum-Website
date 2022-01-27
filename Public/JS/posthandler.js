// Constants
const url = "https://Forum-Website.devkrxspl.repl.co";

// Functions
function sendPostRequest(data, page) {

  const request = new XMLHttpRequest();

  // Setting up json post request with UTF-8 charset
  request.open("POST", `${url}/${page}`, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.send(JSON.stringify(data));
}