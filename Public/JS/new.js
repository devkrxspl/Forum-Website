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
  } else if (e.key == "Enter") {
    e.preventDefault();

    const postContainer = document.getElementById("post-container");
    
    var element = document.createElement("p");
    var selection = window.getSelection();
    var range = document.createRange();

    const anchorNode = selection.anchorNode;

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
    element.innerHTML = "";

    // Placing the caret after the current element
    var parent = anchorNode.id;
    
    if (anchorNode.id != "post-container") {
      parent = getParent(anchorNode);
    }

    if (parent.nextSibling) {
      postContainer.insertBefore(element, parent.nextSibling);
    } else {
      postContainer.appendChild(element);
    }

    // Splitting text
    const pos = selection.anchorOffset;// getCaretPosition(parent);

    // Handling styling tags surrounding the cursor
    var current = anchorNode;
    var offset = 0;
    

    while (current.parentNode && current.parentNode.id != "post-container") {
      console.log(current.nodeName);
      if (current.nodeName != "#text") {
        offset += current.outerHTML.length - current.innerHTML.length - current.nodeName.length - 3;
      }

      current = current.parentNode;

    }
    
    element.innerHTML = parent.innerHTML.substring(pos + offset);
    parent.innerHTML = parent.innerHTML.substring(0, pos + offset);

    // Setting the cursor in the new element
    range.selectNodeContents(element);
    range.setStart(element, 0);
    range.setEnd(element, 0);
    
    selection.removeAllRanges();
    selection.addRange(range);
    
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