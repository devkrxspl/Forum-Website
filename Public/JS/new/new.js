// Constants 
const socket = io();
const documentHistory = [];
const focusHistory = [];
const caretHistory = [];

// Variables
var focusedParagraph = document.getElementsByClassName("paragraph")[0];

// Functions
function logout() {
  delete localStorage.jwt;
  window.location = "";
}

function getParent(node) {
  
  if (node.parentNode.id != "post-container") {
    return getParent(node.parentNode);
  }

  return node;
}

document.getElementById("post-container").addEventListener("keydown", function(e){

  if (e.key == 'Tab') {
    e.preventDefault();
    
    pasteHtmlAtCaret("&#9;");
  } else if (e.key == "Backspace") {

    const paragraphs = document.getElementsByClassName("paragraph");

    // Checking if the paragraph is empty (and therefore would be deleted on backspace)
    if (paragraphs.length == 1 && (paragraphs[0].innerHTML == "<br>" || paragraphs[0].innerHTML == "<br><br>" || paragraphs[0].innerHTML == "")) {
      e.preventDefault();
    }

  // Capturing CTRL + Z
  } else if (e.keyCode == 90 && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    documentHistory.pop();

    const a = documentHistory[documentHistory.length - 1];

    if (a) {
      document.getElementById("post-container").innerHTML = a;
    } else {
      document.getElementById("post-container").innerHTML = '<p class="paragraph" contenteditable="true"></p>';
    }

    document.getElementById("post-container").focus();
  }
  
});

// Handling CTRL/CMD Z
document.getElementById("post-container").addEventListener("keyup", function(e){
  
  // Caching current document
  if (!(e.keyCode == 90 && e.ctrlKey)) {

    // Only cache content if the current document state is different from the last (so there are no duplicates)
    if (document.getElementById("post-container").innerHTML != documentHistory[documentHistory.length - 1]) {

      var selection = window.getSelection();
      var range = document.createRange();
      
      documentHistory.push(document.getElementById("post-container").innerHTML);
      
      if (selection.anchorNode.id == "post-container") {
        focusHistory.push(selection.anchorNode);
      } else {
        focusHistory.push(getParent(selection.anchorNode));
      }
    }
  }
});

// Handling copy and paste
document.getElementById("post-container").addEventListener("paste", function(e) {

    e.preventDefault();

    document.execCommand("insertHTML", false, (e.originalEvent || e).clipboardData.getData('text/plain'));
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