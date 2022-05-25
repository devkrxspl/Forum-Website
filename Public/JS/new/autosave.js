// Loading autosave
if (window.localStorage.autosave) {
  document.body.innerHTML = window.localStorage.autosave;
}

setInterval(function(){
  window.localStorage.autosave = document.body.innerHTML;
}, 1000);