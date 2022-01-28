// Constants
const socket = io();

// Variables
var loggingIn = false;

// Functions
function login() {
  
  if (!loggingIn) {

    loggingIn = true;
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    socket.emit("login", {username : username, password : password});

    // Waiting for response
    var response = false;

    socket.on("login", (data) => {
      alert(data.response);

      loggingIn = false;
      response = true;

      socket.off("login");
    });

    setTimeout(function(){

      // If no response, handle error
      if (!response) {
        loggingIn = false;
        alert("There was an error reaching our servers.");
      }

      // Disconnecting listener
      socket.off("login");
    }, 5000);
  }
}