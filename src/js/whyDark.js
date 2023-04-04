import { ClickManager  } from "/modules/buttonHandler.js";
const manager = new ClickManager();

var juicyMeats = document.querySelector(".juicy-meats");
var darkMode = document.querySelector("#mode-switch");
var whyTitle = document.querySelector("#why-title")

const body = document.body;
var debounce = false;

function switchBackgrounds() {
  if (!debounce) {
    debounce = true;
    body.classList.toggle("dark");
    juicyMeats.classList.toggle("active");
    darkMode.classList.toggle('active')
    whyTitle.classList.toggle('active')
  } else if (debounce) {
    debounce = false;
    body.classList.toggle("dark");
    juicyMeats.classList.toggle("active");
    darkMode.classList.toggle('active')
    whyTitle.classList.toggle('active')

  }
}


manager.handle(darkMode, switchBackgrounds)