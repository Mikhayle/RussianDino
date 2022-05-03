
document.querySelector(".menu-burger").addEventListener("touchstart", () => {
	document.querySelector(".menu-burger").classList.toggle("active");
	document.querySelector(".lettering__list").classList.toggle("active");
	document.body.classList.toggle("disable-scroll");
});

document.querySelectorAll(`.lettering__item`).forEach((menuItem) => {
	menuItem.addEventListener(`click`, () => {
		document.body.classList.remove("disable-scroll");
	})
})

window.addEventListener('resize', () => {
	let vh = window.visualViewport.height * 0.01;
	document.querySelector(".lettering__list").style.setProperty('--vh', `${vh}px`);
});
