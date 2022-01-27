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
    console.log(data);

    response = true;
  });

  setTimeout(function(){

    // Disconnecting listener
    socket.off("login");
  }, 5000);
}