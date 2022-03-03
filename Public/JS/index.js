// Constants 
const socket = io();

const resize_events = [
  "onresize",
  "onload"
];

// Functions
function logout() {
  delete localStorage.jwt;
  window.location = "";
}

// Main 
resize_events.forEach(function(e) {
  window[e] = function(event) {
    const width = window.innerWidth|| document.documentElement.clientWidth || document.body.clientWidth;
  
    if (width < 1337) {
      document.getElementById("menu-bar-left").style.opacity = "0";
      document.getElementById("menu-bar-right").style.opacity = "0";
  
      document.getElementById("post-container").style.right = "calc(50% - 350px)";
    } else {
      document.getElementById("menu-bar-left").style.opacity = "1";
      document.getElementById("menu-bar-right").style.opacity = "1";
  
      document.getElementById("post-container").style.right = "max(80px + 300px, calc(50% - 350px))";
    }
  }
});

(async () => {
  if (localStorage.jwt != undefined) {
    
    const response = await sendMessage("getUserInfo", {jwt : localStorage.jwt}, 5000);

    if (!response.error) {
      
    } else if (response.error == 4) {
      delete localStorage.jwt;
    } else if (response.error == 5) {
      alert("Error connecting to server.");
    } else {
      alert(response.response);
    }
  } 
})();