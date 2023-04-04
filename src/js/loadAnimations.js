var element1 = document.querySelector('#front-text')
var element2 = document.querySelector('#front-button')

element2.style.opacity = "0"

element1.addEventListener("animationend", async () =>{
	element2.style.transition = "0.3s"
	element2.style.opacity = "1"
})


if (performance.navigation.type === 1){

	element2.style.transition = "0s"
	element2.style.opacity = "0"

}
