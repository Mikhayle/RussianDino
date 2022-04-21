;(() => {
  function onEntry(entry) {
    if (window.innerWidth > 1000) {
      entry.forEach((change) => {
        if (change.isIntersecting) {
          change.target.classList.add('element-show')
        }
      })
    }
  }

  const options = { threshold: [0.5] }
  const observer = new IntersectionObserver(onEntry, options)
  const elements = document.querySelectorAll('.element-animation')
  for (const elm of elements) {
    observer.observe(elm)
  }
})()


const smoothLinks = document.querySelectorAll('a[href^="#"]')
for (let smoothLink of smoothLinks) {
  smoothLink.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('.lettering__list').classList.remove('active')
    document.querySelector('.menu-burger').classList.remove('active')
  })
}

