// Loading autosave
if (window.localStorage.jwt) {
  if (window.localStorage.autosave) {
    document.body.innerHTML = window.localStorage.autosave;
  }
} else {
  window.location.replace("/login");
}
  
// Autosaving

  setInterval(function(){
    window.localStorage.autosave = document.body.innerHTML;
  
    (async () => {
      const response = await sendMessage("autosave", {jwt : window.localStorage.jwt}, 5000);

      if (response.error == 5) {
        loggingIn = false;
        console.log("Could not autosave: There was an error reaching our servers.");
  
      } else if (response.error == 4) {
        console.log("Invalid JWT.");
        delete localStorage.jwt;
        window.location.replace("/login");
  
      } else {
        console.log("Autosave successful.");
      }
    })();  
    
  }, 4000);