// Constants
const socket = io();

// Variables
var signingUp = false;

// Functions
function signup() {
  
  if (!signingUp) {

    signingUp = true;

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    socket.emit("signup", {username : username, password : password});

    // Waiting for response
    var response = false;

    socket.on("signup", (data) => {
      alert(data.response);

      loggingIn = false;
      response = true;
      
      socket.off("signup");
    });

    setTimeout(function(){

      // If no response, handle error
      if (!response) {
        signingUp = false;
        alert("There was an error reaching our servers.");
      }

      // Disconnecting listener
      socket.off("signup");
    }, 5000);
  }
}