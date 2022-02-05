 // Constants
const socket = io();

// Variables
var loggingIn = false;

// Functions
async function login() {
  
  if (!loggingIn) {

    loggingIn = true;
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await sendMessage("login", {username : username, password : password}, 5000);

    if (!response.error) {

      loggingIn = false;
      localStorage.jwt = response.jwt;
      window.location="https://Forum-Website.devkrxspl.repl.co";

    } else if (response.error == 5) {
      
      loggingIn = false;
      alert("There was an error reaching our servers.");

    } else {
      loggingIn = false;
      alert(response.response);
    }
  }
}

if (localStorage.jwt) {
  window.location = "https://Forum-Website.devkrxspl.repl.co";
}