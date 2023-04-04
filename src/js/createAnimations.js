var title = document.querySelector("#title")
var footer = document.querySelector("#footer")
var createContainer = document.querySelector(".create-container")
var button = document.querySelector(".submit-container")

footer.style.opacity = "0"
createContainer.style.opacity = "0"
button.style.opacity = "0"

title.addEventListener("animationend", async() => {
    footer.style.animation = "fade-in-footer 1s";
})

footer.addEventListener("animationend", async() =>{
    footer.style.opacity = "1"
    createContainer.style.animation = "fade-in-form 1s"
})

createContainer.addEventListener("animationend", async() =>{
    createContainer.style.opacity = "1"
    button.style.animation = "fade-in-button 1s"
})

button.addEventListener("animationend", async() =>{
    button.style.opacity = "1"
})