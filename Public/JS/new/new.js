
// Constants 
const documentHistory = [];
const focusHistory = [];
const caretHistory = [];

// Variables
var defaultParagraph = document.getElementsByClassName("paragraph")[0];
var socket = io();

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
    if (paragraphs.length == 1 && paragraphs[0].innerHTML.replace(/<br>/g, "") == "") {
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
  
}, true);

// Caching previous document versions
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

  const text = (e.originalEvent || e).clipboardData.getData('text/plain').split("\n");

  var selection = window.getSelection();
  var range = document.createRange();
  var current = getParent(selection.anchorNode);

  for (var i = 0; i < text.length; i++) {
    if (i == 0) {
      document.execCommand("insertHTML", false, text[i]);
    } else if (text[i].replace(/\n/g, "") != "") {
      console.log(getParent(selection.anchorNode));

      var element = document.createElement("div");
  
      element.innerHTML = text[i];
      element.classList.add("paragraph");
      element.contentEditable = true;
  
      current.parentNode.insertBefore(element, current.nextSibling);
      current = element;
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