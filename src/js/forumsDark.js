import { ClickManager  } from "/modules/buttonHandler.js";
const manager = new ClickManager();

const body = document.body;
var darkMode = document.querySelector("#mode-switch");
var awkward = document.querySelector("#awkward");
var title = document.querySelector(".title")
var debounce = false;

function switchBackgrounds(){
  if (!debounce) {
    debounce = true;
    body.classList.toggle("dark");
    awkward.classList.toggle("active");
  } else if (debounce) {
    debounce = false;
    body.classList.toggle("dark");
    awkward.classList.toggle("active");
  }
}

function changeLocation(){
  window.location.href = window.location.origin+'/forums'
}

manager.handle(darkMode, switchBackgrounds)


