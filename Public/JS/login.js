// Constants
const socket = io();

// Functions
function login() {
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  socket.emit("login", {username : username, password : password});

  // Waiting for response
  var response = false;

  socket.on("login", (data) => {
    alert(data.response);

    response = true;

    socket.off("login");
  });

  setTimeout(function(){

    // If no response, handle error
    if (!response) {
      alert("There was an error reaching our servers.");
    }

    // Disconnecting listener
    socket.off("login");
  }, 5000);
}