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
    alert(data.response);

    response = true;

    socket.off("signup");
  });

  setTimeout(function(){

    // If no response, handle error
    if (!response) {
      alert("There was an error reaching our servers.");
    }

    // Disconnecting listener
    socket.off("signup");
  }, 5000);
}