
document.querySelector(".menu-burger").addEventListener("touchstart", () => {
  document.querySelector(".menu-burger").classList.toggle("active");
  document.querySelector(".lettering__list").classList.toggle("active");
});

window.addEventListener('resize', () => {
  let vh = window.visualViewport.height * 0.01;
  document.querySelector(".lettering__list").style.setProperty('--vh', `${vh}px`);
});

function removeMenu() {
  let scroll = window.pageYOffset;
  if (scroll > 300) {
    document.querySelector(".lettering__list").classList.remove("active");
    document.querySelector(".menu-burger").classList.remove("active");
  }
}
window.addEventListener('scroll', removeMenu, true);