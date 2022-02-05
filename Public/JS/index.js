// Constants 
const socket = io();

// Functions
function logout() {
  delete localStorage.jwt;
  window.location = "";
}

// Main 
(async () => {
  if (localStorage.jwt != undefined) {
    
    const response = await sendMessage("getUserInfo", {jwt : localStorage.jwt}, 5000);

    if (!response.error) {
      document.getElementById("welcomeMessage").innerHTML = `Welcome, ${response.username}`;
    } else if (response.error == 4) {

      alert("Invalid token provided.");
      delete localStorage.jwt;
      document.location = "https://Forum-Website.devkrxspl.repl.co";
    } else if (response.error == 5) {
      alert("Error connecting to server.");
    } else {
      alert(response.response);
    }
  } 
})();