// Constants
const socket = io();

// Variables
var signingUp = false;

// Functions
async function signup() {
  
  if (!signingUp) {

    signingUp = true;

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await sendMessage("signup", {username : username, password : password}, 5000);

    if (!response.error) {

      signingUp = false;
      localStorage.jwt = response.jwt;
      window.location="https://Forum-Website.devkrxspl.repl.co";

    } else if (response.error == 5) {
      
      signingUp = false;
      alert("There was an error reaching our servers.");

    } else {
      signingUp = false;
      alert(response.response);
    }
  }
}