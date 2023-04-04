import { ClickManager  } from "/modules/buttonHandler.js";
const manager = new ClickManager();

const body = document.body;
var darkMode = document.querySelector("#mode-switch");
var frontText = document.querySelector("#front-text");
var forumButton = document.querySelector("#front-button")
var debounce = false;

function switchBackgrounds(){
  if (!debounce) {
    debounce = true;
    body.classList.toggle("dark");
    darkMode.classList.toggle("active");
    frontText.classList.toggle("active")
  } else if (debounce) {
    debounce = false;
    body.classList.toggle("dark");
    darkMode.classList.toggle("active");
    frontText.classList.toggle("active")
  }
}

function changeLocation(){
  window.location.href = window.location.origin+'/forums'
}

manager.handle(forumButton, changeLocation)


