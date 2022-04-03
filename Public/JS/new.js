// Constants 
const socket = io();

// Variables
var focusedParagraph = document.getElementsByClassName("paragraph")[0];

// Functions
function logout() {
  delete localStorage.jwt;
  window.location = "";
}

function getParent(node) {
  console.log(node);
  if (node.nodeName != "P") {
    return getParent(node.parentNode);
  }

  return node;
}

document.getElementById("post-container").addEventListener("keydown", function(e){
  if (e.key == 'Tab') {
    e.preventDefault();
    
    pasteHtmlAtCaret("&#9;");
  } else if (e.key == "Enter") {
    e.preventDefault();

    const postContainer = document.getElementById("post-container");
    
    var element = document.createElement("p");
    var selection = window.getSelection();
    var range = document.createRange();

    // If there is text selected while entering, delete it
    if (selection.toString().length > 0) {
      document.execCommand('delete', false, null);

      // Updating the selection and range
      selection = window.getSelection();
      range = document.createRange();
    }

    // Creating a new paragraph
    element.classList.add("paragraph");
    element.setAttribute("contenteditable", "true");
    element.setAttribute("tabindex", "1");
    element.innerHTML = "\u00a0";

    // Placing the caret after the current element
    var parent = getParent(selection.anchorNode);

    console.log(parent);

    if (parent.nextSibling) {
      postContainer.insertBefore(element, parent.nextSibling);
    } else {
      postContainer.appendChild(element);
    }
  
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    
    document.execCommand('delete', false, null);

    // Selecting the new element
    element.focus();
  } else if (e.key == "Backspace") {

    const paragraphs = document.getElementsByClassName("paragraph");

    if (paragraphs.length == 1 && paragraphs[0].innerHTML == "<br>") {
      e.preventDefault();
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