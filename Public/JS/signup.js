// Constants
const socket = io();

// Functions
function signup() {
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  socket.emit("signup", {username : username, password : password});

  // Waiting for response
  var response = false;

  socket.on("signup", (data) => {
    console.log(data);

    response = true;
  });

  setTimeout(function(){

    // If no response, handle error

    // Disconnecting listener
    socket.off("signup");
  }, 5000);
}