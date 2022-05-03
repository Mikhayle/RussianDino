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


document.addEventListener("DOMContentLoaded", () =>{
  const lazyLoadVideos = [].slice.call(document.querySelectorAll("video.lazy-video"));
   if ("IntersectionObserver" in window) {
    const lazyVideoObserver = new IntersectionObserver((entries, observer)=> {
     entries.forEach((video)=>{
      if (video.isIntersecting) {
       for (const source in video.target.children) {
       const videoSource = video.target.children[source];
        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
         videoSource.src = videoSource.dataset.src;
        }
       }
       video.target.load();
       video.target.classList.remove("lazy-video");
       lazyVideoObserver.unobserve(video.target);
      }
     });
    });
    lazyLoadVideos.forEach((lazyVideo)=> {
     lazyVideoObserver.observe(lazyVideo);
    });
   }
 });

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

const fixBlocks = document.querySelectorAll('.fix-block');
const body = document.body;
class Modal {
  
  constructor(options) {
    let defaultOptions = {
      isOpen: () => {},
      isClose: () => {},
    };
    this.options = Object.assign(defaultOptions, options);
    const modal = document.querySelector(".modal");
      this.modal = modal;
    this.speed = false;
    this.animation = false;
    this.isOpen = false;
    this.modalContainer = false;
    this.previousActiveElement = false;

    this.focusElements = [
      "a[href]",
      "input",
      "button",
      "select",
      "textarea",
      "[tabindex]",
    ];
    this.events();
  }

  events() {
    if (this.modal) {
      document.addEventListener(
        "click",
        function (e) {
          const clickedElement = e.target.closest("[data-path]");
          if (clickedElement) {
            let target = clickedElement.dataset.path;
            let animation = clickedElement.dataset.animation;
            let speed = clickedElement.dataset.speed;
            this.animation = animation ? animation : "fade";
            this.speed = speed ? parseInt(speed) : 300;
            this.modalContainer = document.querySelector(
              `[data-target="${target}"]`
            );
            this.open();
            return;
          }

          if (e.target.closest(".modal-close") || e.target.closest(".modal-close--black")) {
            this.close();
            return;
          }
        }.bind(this)
      );

      window.addEventListener(
        "keydown",
        function (e) {
          if (e.keyCode == 27) {
            if (this.isOpen) {
              this.close();
            }
          }

          if (e.keyCode == 9 && this.isOpen) {
            this.focusCatch(e);
            return;
          }
        }.bind(this)
      );

      this.modal.addEventListener(
        "click",
        function (e) {
          if (
            !e.target.classList.contains("modal-card") &&
            !e.target.closest(".modal-card") &&
            this.isOpen
          ) {
            this.close();
          }
        }.bind(this)
      );
    }
  }

  open() {
    this.previousActiveElement = document.activeElement;

    this.modal.style.setProperty("--transition-time", `${this.speed / 1000}s`);
    this.modal.classList.add("is-open");
    this.disableScroll();

    this.modalContainer.classList.add("modal-open");
    this.modalContainer.classList.add(this.animation);

    setTimeout(() => {
      this.options.isOpen(this);
      this.modalContainer.classList.add("animate-open");
      this.isOpen = true;
      this.focusTrap();
    }, this.speed);
  }

  close() {
    if (this.modalContainer) {
      this.modalContainer.classList.remove("animate-open");
      this.modalContainer.classList.remove(this.animation);
      this.modal.classList.remove("is-open");
      this.modalContainer.classList.remove("modal-open");
      this.enableScroll();
      this.options.isClose(this);
      this.isOpen = false;
      this.focusTrap();
    }
  }

  focusCatch(e) {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);

    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }

    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }

  focusTrap() {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);
    if (this.isOpen) {
      focusable[0].focus();
    } else {
      this.previousActiveElement.focus();
    }
  }

  disableScroll() {
    let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
    let pagePosition = window.scrollY;
    fixBlocks.forEach((el) => {
      el.style.paddingRight = paddingOffset;
    });
    body.style.paddingRight = paddingOffset;
    body.classList.add('disable-scroll');
    body.dataset.position = pagePosition;
    body.style.top = -pagePosition + 'px';
  }
  
  enableScroll() {
    let pagePosition = parseInt(document.body.dataset.position, 10);
    body.style.top = 'auto';
    body.classList.remove('disable-scroll');
    fixBlocks.forEach((el) => {
      el.style.paddingRight = '0px';
    });
    body.style.paddingRight = '0px';
    window.scroll({top: pagePosition, left: 0});
    body.removeAttribute('data-position');
  }
}

const modal = new Modal();
const portfolio01 = document.querySelector(".portfolio-swiper-one");
if (portfolio01) {
	const portfolioSwiper01 = new Swiper('.portfolio-swiper-one', {
		spaceBetween: 25,
		wrapperClass: "portfolio-swiper-wrapper-one",
		slideClass: "portfolio-swiper-slide-one",
		loop: true,
		grabCursor: true,
		observer: true,
		observeParents: true,
		slidesPerView: 1.2,

		navigation: {
			nextEl: ".portfolio-button__next",
			prevEl: ".portfolio-button__prev",
		},
		breakpoints: {
			500: {
				slidesPerView: 1.5,
			},
			1024: {
				slidesPerView: 2,
				spaceBetween: 30,
			},
			1440: {
				slidesPerView: 2.2,
			},
			1920: {
				slidesPerView: 2.7,
			},
		}
	});
}

const portfolio02 = document.querySelector(".portfolio-swiper-two");
if (portfolio02) {
	const portfolioSwiper02 = new Swiper('.portfolio-swiper-two', {
		spaceBetween: 25,
		wrapperClass: "portfolio-swiper-wrapper-two",
		slideClass: "portfolio-swiper-slide-two",
		grabCursor: true,
		loop: true,
		observer: true,
		observeParents: true,
		slidesPerView: 1.2,
		navigation: {
			nextEl: ".portfolio-button__next",
			prevEl: ".portfolio-button__prev",
		},
		breakpoints: {
			500: {
				slidesPerView: 1.5,
			},
			1024: {
				slidesPerView: 2,
				spaceBetween: 30,
			},
			1440: {
				slidesPerView: 2.2,
			},
			1920: {
				slidesPerView: 2.7,
			},
		}
	});
}
const workSwiper1 = document.querySelector(".work__swiper-one");
if (workSwiper1) {
	const workSwiper1 = new Swiper('.work__swiper-one', {
		spaceBetween: 30,
		wrapperClass: "work-swiper-wrapper-one",
		slideClass: "work__swiper-slide-one",
		slidesPerView: 4,
		loop: true,
		speed: 7000,
		autoplay: {
			delay: 0,
		},
		breakpoints: {
			768: {
				slidesPerView: 5,
			},
			1200: {
				slidesPerView: 6,
			},
		}
	})
}
const workSwiper2 = document.querySelector(".work__swiper-two");
if (workSwiper2) {
	const workSwiper2 = new Swiper('.work__swiper-two', {
		spaceBetween: 30,
		wrapperClass: "work-swiper-wrapper-two",
		slideClass: "work__swiper-slide-two",
		loop: true,
		slidesPerView: 4,
		speed: 7000,
		autoplay: {
			delay: 0,
			reverseDirection: true,
		},
		breakpoints: {
			768: {
				slidesPerView: 5,
			},
			1200: {
				slidesPerView: 6,
			},
		}
	})
}

const aboutSwiper1 = document.querySelector(".about__swiper-one");
if (aboutSwiper1) {
	const aboutSwiper1 = new Swiper('.about__swiper-one', {
		spaceBetween: 10,
		wrapperClass: "about__swiper-wrapper-one",
		slideClass: "about__swiper-slide-one",
		slidesPerView: 3,
		loop: true,
		speed: 7000,
		autoplay: {
			delay: 0
		},
		followFinger: false,
		breakpoints: {
			768: {
				slidesPerView: 5,
				spaceBetween: 30
			},
			1200: {
				slidesPerView: 6,
				spaceBetween: 30
			},
		}
	})
}
const aboutSwiper2 = document.querySelector(".about__swiper-two");
if (aboutSwiper2) {
	const aboutSwiper2 = new Swiper('.about__swiper-two', {
		spaceBetween: 10,
		wrapperClass: "about-swiper-wrapper-two",
		slideClass: "about__swiper-slide-two",
		loop: true,
		slidesPerView: 3,
		speed: 7000,
		autoplay: {
			delay: 0,
			reverseDirection: true
		},
		followFinger: false,
		breakpoints: {
			768: {
				slidesPerView: 5,
				spaceBetween: 30
			},
			1200: {
				slidesPerView: 6,
				spaceBetween: 30
			},
		}
	})
}

const validate = document.querySelector('.js-validate')
if (validate) {
  if (validate) {
    const validation = new JustValidate(validate)
    validation.addField('#user-mail', [
      {
        rule: 'required',
        errorMessage: 'Электронная почта обязательна',
      },
      {
        rule: 'email',
        errorMessage: 'Электронная почта недействительна',
      },
    ])
  }

  const inputsNew = [].slice.call(document.querySelectorAll('.new-input'))
  const buttonNew = document.querySelector('.new-offer__btn')

  inputsNew.forEach((el) => {
    el.addEventListener('input', checkInputs, false)
  })

  function checkInputs() {
      const empty = inputsNew.filter((e) => {
        return e.value.trim() === ''
      }).length
      buttonNew.disabled = empty !== 0
    }
  checkInputs()


  const inputFeedback = [].slice.call(document.querySelectorAll('.feedback-input'))
  const buttonsFeedback = document.querySelector('.feedback__btn')

  inputFeedback.forEach((el) => {
    el.addEventListener('input', checkInput, false)
  })
  // const feedback = document.querySelector('.feedback-consent')
  // const input = document.querySelector('.feedback-details__input')

  // feedback.addEventListener('click', () => {
  //   setTimeout(() => {
  //   if (input.checked) {
  //     input.checked = false
  //   } else {
  //     input.checked = true
  //   }
  // }, 300);
  // })
  const agreementCheckbox = document.querySelector('#input-checkbox')
  agreementCheckbox.addEventListener('click', checkInput)

  function checkInput() {
    const empty = inputFeedback.filter((e) => {
      return e.value.trim() === ''
    }).length
    console.log(agreementCheckbox.checked)
    buttonsFeedback.disabled = empty !== 0 || !agreementCheckbox.checked
  }
  checkInput()
  const validates = document.querySelector('.js-validates')
  if (validates) {
    const validation = new JustValidate(validates)
    validation.addField('#user-name', [
      {
        rule: 'required',
        errorMessage: 'Поле Имя не может быть пустым',
      },
    ]),
      // validation.addField('#user-phone', [
      //   {
      //     rule: 'customRegexp',
      //     value: /((\+7|7|8)+([0-9]){10})$/,
      //     errorMessage: 'Некорректный номер телефона',
      //   },
      // ]),
      validation.addField('#input-checkbox', [
        {
          rule: 'required',
          errorMessage: 'Согласие обязательно при отправке данных!',
        },
      ])
  }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwibGF6eS1sb2FkLmpzIiwibWVudS5qcyIsIm1vZGFsLmpzIiwic3dpcGVycy5qcyIsInZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIG9uRW50cnkoZW50cnkpIHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDEwMDApIHtcclxuICAgICAgZW50cnkuZm9yRWFjaCgoY2hhbmdlKSA9PiB7XHJcbiAgICAgICAgaWYgKGNoYW5nZS5pc0ludGVyc2VjdGluZykge1xyXG4gICAgICAgICAgY2hhbmdlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdlbGVtZW50LXNob3cnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IG9wdGlvbnMgPSB7IHRocmVzaG9sZDogWzAuNV0gfVxyXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKG9uRW50cnksIG9wdGlvbnMpXHJcbiAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZWxlbWVudC1hbmltYXRpb24nKVxyXG4gIGZvciAoY29uc3QgZWxtIG9mIGVsZW1lbnRzKSB7XHJcbiAgICBvYnNlcnZlci5vYnNlcnZlKGVsbSlcclxuICB9XHJcbn0pKClcclxuXHJcblxyXG5jb25zdCBzbW9vdGhMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl49XCIjXCJdJylcclxuZm9yIChsZXQgc21vb3RoTGluayBvZiBzbW9vdGhMaW5rcykge1xyXG4gIHNtb290aExpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGV0dGVyaW5nX19saXN0JykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51LWJ1cmdlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgfSlcclxufVxyXG5cclxuIiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT57XHJcbiAgY29uc3QgbGF6eUxvYWRWaWRlb3MgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ2aWRlby5sYXp5LXZpZGVvXCIpKTtcclxuICAgaWYgKFwiSW50ZXJzZWN0aW9uT2JzZXJ2ZXJcIiBpbiB3aW5kb3cpIHtcclxuICAgIGNvbnN0IGxhenlWaWRlb09ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbnRyaWVzLCBvYnNlcnZlcik9PiB7XHJcbiAgICAgZW50cmllcy5mb3JFYWNoKCh2aWRlbyk9PntcclxuICAgICAgaWYgKHZpZGVvLmlzSW50ZXJzZWN0aW5nKSB7XHJcbiAgICAgICBmb3IgKGNvbnN0IHNvdXJjZSBpbiB2aWRlby50YXJnZXQuY2hpbGRyZW4pIHtcclxuICAgICAgIGNvbnN0IHZpZGVvU291cmNlID0gdmlkZW8udGFyZ2V0LmNoaWxkcmVuW3NvdXJjZV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2aWRlb1NvdXJjZS50YWdOYW1lID09PSBcInN0cmluZ1wiICYmIHZpZGVvU291cmNlLnRhZ05hbWUgPT09IFwiU09VUkNFXCIpIHtcclxuICAgICAgICAgdmlkZW9Tb3VyY2Uuc3JjID0gdmlkZW9Tb3VyY2UuZGF0YXNldC5zcmM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgdmlkZW8udGFyZ2V0LmxvYWQoKTtcclxuICAgICAgIHZpZGVvLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwibGF6eS12aWRlb1wiKTtcclxuICAgICAgIGxhenlWaWRlb09ic2VydmVyLnVub2JzZXJ2ZSh2aWRlby50YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGxhenlMb2FkVmlkZW9zLmZvckVhY2goKGxhenlWaWRlbyk9PiB7XHJcbiAgICAgbGF6eVZpZGVvT2JzZXJ2ZXIub2JzZXJ2ZShsYXp5VmlkZW8pO1xyXG4gICAgfSk7XHJcbiAgIH1cclxuIH0pOyIsIlxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtYnVyZ2VyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsICgpID0+IHtcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtYnVyZ2VyXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sZXR0ZXJpbmdfX2xpc3RcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKTtcclxuXHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJkaXNhYmxlLXNjcm9sbFwiKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAubGV0dGVyaW5nX19pdGVtYCkuZm9yRWFjaCgobWVudUl0ZW0pID0+IHtcclxuXHRtZW51SXRlbS5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsICgpID0+IHtcclxuXHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGUtc2Nyb2xsXCIpO1xyXG5cdH0pXHJcbn0pXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG5cdGxldCB2aCA9IHdpbmRvdy52aXN1YWxWaWV3cG9ydC5oZWlnaHQgKiAwLjAxO1xyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGV0dGVyaW5nX19saXN0XCIpLnN0eWxlLnNldFByb3BlcnR5KCctLXZoJywgYCR7dmh9cHhgKTtcclxufSk7XHJcbiIsImNvbnN0IGZpeEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maXgtYmxvY2snKTtcclxuY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbmNsYXNzIE1vZGFsIHtcclxuICBcclxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICBsZXQgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgIGlzT3BlbjogKCkgPT4ge30sXHJcbiAgICAgIGlzQ2xvc2U6ICgpID0+IHt9LFxyXG4gICAgfTtcclxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsXCIpO1xyXG4gICAgICB0aGlzLm1vZGFsID0gbW9kYWw7XHJcbiAgICB0aGlzLnNwZWVkID0gZmFsc2U7XHJcbiAgICB0aGlzLmFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcclxuICAgIHRoaXMubW9kYWxDb250YWluZXIgPSBmYWxzZTtcclxuICAgIHRoaXMucHJldmlvdXNBY3RpdmVFbGVtZW50ID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5mb2N1c0VsZW1lbnRzID0gW1xyXG4gICAgICBcImFbaHJlZl1cIixcclxuICAgICAgXCJpbnB1dFwiLFxyXG4gICAgICBcImJ1dHRvblwiLFxyXG4gICAgICBcInNlbGVjdFwiLFxyXG4gICAgICBcInRleHRhcmVhXCIsXHJcbiAgICAgIFwiW3RhYmluZGV4XVwiLFxyXG4gICAgXTtcclxuICAgIHRoaXMuZXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBldmVudHMoKSB7XHJcbiAgICBpZiAodGhpcy5tb2RhbCkge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwiY2xpY2tcIixcclxuICAgICAgICBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgY29uc3QgY2xpY2tlZEVsZW1lbnQgPSBlLnRhcmdldC5jbG9zZXN0KFwiW2RhdGEtcGF0aF1cIik7XHJcbiAgICAgICAgICBpZiAoY2xpY2tlZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGNsaWNrZWRFbGVtZW50LmRhdGFzZXQucGF0aDtcclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbiA9IGNsaWNrZWRFbGVtZW50LmRhdGFzZXQuYW5pbWF0aW9uO1xyXG4gICAgICAgICAgICBsZXQgc3BlZWQgPSBjbGlja2VkRWxlbWVudC5kYXRhc2V0LnNwZWVkO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IGFuaW1hdGlvbiA/IGFuaW1hdGlvbiA6IFwiZmFkZVwiO1xyXG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWQgPyBwYXJzZUludChzcGVlZCkgOiAzMDA7XHJcbiAgICAgICAgICAgIHRoaXMubW9kYWxDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgIGBbZGF0YS10YXJnZXQ9XCIke3RhcmdldH1cIl1gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoXCIubW9kYWwtY2xvc2VcIikgfHwgZS50YXJnZXQuY2xvc2VzdChcIi5tb2RhbC1jbG9zZS0tYmxhY2tcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICBcImtleWRvd25cIixcclxuICAgICAgICBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAyNykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDkgJiYgdGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1c0NhdGNoKGUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB0aGlzLm1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgXCJjbGlja1wiLFxyXG4gICAgICAgIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJtb2RhbC1jYXJkXCIpICYmXHJcbiAgICAgICAgICAgICFlLnRhcmdldC5jbG9zZXN0KFwiLm1vZGFsLWNhcmRcIikgJiZcclxuICAgICAgICAgICAgdGhpcy5pc09wZW5cclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvcGVuKCkge1xyXG4gICAgdGhpcy5wcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cclxuICAgIHRoaXMubW9kYWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLXRyYW5zaXRpb24tdGltZVwiLCBgJHt0aGlzLnNwZWVkIC8gMTAwMH1zYCk7XHJcbiAgICB0aGlzLm1vZGFsLmNsYXNzTGlzdC5hZGQoXCJpcy1vcGVuXCIpO1xyXG4gICAgdGhpcy5kaXNhYmxlU2Nyb2xsKCk7XHJcblxyXG4gICAgdGhpcy5tb2RhbENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwibW9kYWwtb3BlblwiKTtcclxuICAgIHRoaXMubW9kYWxDb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLmFuaW1hdGlvbik7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5pc09wZW4odGhpcyk7XHJcbiAgICAgIHRoaXMubW9kYWxDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFuaW1hdGUtb3BlblwiKTtcclxuICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG4gICAgICB0aGlzLmZvY3VzVHJhcCgpO1xyXG4gICAgfSwgdGhpcy5zcGVlZCk7XHJcbiAgfVxyXG5cclxuICBjbG9zZSgpIHtcclxuICAgIGlmICh0aGlzLm1vZGFsQ29udGFpbmVyKSB7XHJcbiAgICAgIHRoaXMubW9kYWxDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImFuaW1hdGUtb3BlblwiKTtcclxuICAgICAgdGhpcy5tb2RhbENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuYW5pbWF0aW9uKTtcclxuICAgICAgdGhpcy5tb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwiaXMtb3BlblwiKTtcclxuICAgICAgdGhpcy5tb2RhbENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtb3BlblwiKTtcclxuICAgICAgdGhpcy5lbmFibGVTY3JvbGwoKTtcclxuICAgICAgdGhpcy5vcHRpb25zLmlzQ2xvc2UodGhpcyk7XHJcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZm9jdXNUcmFwKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb2N1c0NhdGNoKGUpIHtcclxuICAgIGNvbnN0IGZvY3VzYWJsZSA9IHRoaXMubW9kYWxDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCh0aGlzLmZvY3VzRWxlbWVudHMpO1xyXG4gICAgY29uc3QgZm9jdXNBcnJheSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZvY3VzYWJsZSk7XHJcbiAgICBjb25zdCBmb2N1c2VkSW5kZXggPSBmb2N1c0FycmF5LmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcblxyXG4gICAgaWYgKGUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSAwKSB7XHJcbiAgICAgIGZvY3VzQXJyYXlbZm9jdXNBcnJheS5sZW5ndGggLSAxXS5mb2N1cygpO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gZm9jdXNBcnJheS5sZW5ndGggLSAxKSB7XHJcbiAgICAgIGZvY3VzQXJyYXlbMF0uZm9jdXMoKTtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9jdXNUcmFwKCkge1xyXG4gICAgY29uc3QgZm9jdXNhYmxlID0gdGhpcy5tb2RhbENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuZm9jdXNFbGVtZW50cyk7XHJcbiAgICBpZiAodGhpcy5pc09wZW4pIHtcclxuICAgICAgZm9jdXNhYmxlWzBdLmZvY3VzKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnByZXZpb3VzQWN0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGlzYWJsZVNjcm9sbCgpIHtcclxuICAgIGxldCBwYWRkaW5nT2Zmc2V0ID0gd2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoICsgJ3B4JztcclxuICAgIGxldCBwYWdlUG9zaXRpb24gPSB3aW5kb3cuc2Nyb2xsWTtcclxuICAgIGZpeEJsb2Nrcy5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICBlbC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nT2Zmc2V0O1xyXG4gICAgfSk7XHJcbiAgICBib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IHBhZGRpbmdPZmZzZXQ7XHJcbiAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUtc2Nyb2xsJyk7XHJcbiAgICBib2R5LmRhdGFzZXQucG9zaXRpb24gPSBwYWdlUG9zaXRpb247XHJcbiAgICBib2R5LnN0eWxlLnRvcCA9IC1wYWdlUG9zaXRpb24gKyAncHgnO1xyXG4gIH1cclxuICBcclxuICBlbmFibGVTY3JvbGwoKSB7XHJcbiAgICBsZXQgcGFnZVBvc2l0aW9uID0gcGFyc2VJbnQoZG9jdW1lbnQuYm9keS5kYXRhc2V0LnBvc2l0aW9uLCAxMCk7XHJcbiAgICBib2R5LnN0eWxlLnRvcCA9ICdhdXRvJztcclxuICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZS1zY3JvbGwnKTtcclxuICAgIGZpeEJsb2Nrcy5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICBlbC5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnMHB4JztcclxuICAgIH0pO1xyXG4gICAgYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnMHB4JztcclxuICAgIHdpbmRvdy5zY3JvbGwoe3RvcDogcGFnZVBvc2l0aW9uLCBsZWZ0OiAwfSk7XHJcbiAgICBib2R5LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wb3NpdGlvbicpO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgbW9kYWwgPSBuZXcgTW9kYWwoKTsiLCJjb25zdCBwb3J0Zm9saW8wMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9ydGZvbGlvLXN3aXBlci1vbmVcIik7XHJcbmlmIChwb3J0Zm9saW8wMSkge1xyXG5cdGNvbnN0IHBvcnRmb2xpb1N3aXBlcjAxID0gbmV3IFN3aXBlcignLnBvcnRmb2xpby1zd2lwZXItb25lJywge1xyXG5cdFx0c3BhY2VCZXR3ZWVuOiAyNSxcclxuXHRcdHdyYXBwZXJDbGFzczogXCJwb3J0Zm9saW8tc3dpcGVyLXdyYXBwZXItb25lXCIsXHJcblx0XHRzbGlkZUNsYXNzOiBcInBvcnRmb2xpby1zd2lwZXItc2xpZGUtb25lXCIsXHJcblx0XHRsb29wOiB0cnVlLFxyXG5cdFx0Z3JhYkN1cnNvcjogdHJ1ZSxcclxuXHRcdG9ic2VydmVyOiB0cnVlLFxyXG5cdFx0b2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcblx0XHRzbGlkZXNQZXJWaWV3OiAxLjIsXHJcblxyXG5cdFx0bmF2aWdhdGlvbjoge1xyXG5cdFx0XHRuZXh0RWw6IFwiLnBvcnRmb2xpby1idXR0b25fX25leHRcIixcclxuXHRcdFx0cHJldkVsOiBcIi5wb3J0Zm9saW8tYnV0dG9uX19wcmV2XCIsXHJcblx0XHR9LFxyXG5cdFx0YnJlYWtwb2ludHM6IHtcclxuXHRcdFx0NTAwOiB7XHJcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogMS41LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQxMDI0OiB7XHJcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogMixcclxuXHRcdFx0XHRzcGFjZUJldHdlZW46IDMwLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQxNDQwOiB7XHJcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogMi4yLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQxOTIwOiB7XHJcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogMi43LFxyXG5cdFx0XHR9LFxyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5jb25zdCBwb3J0Zm9saW8wMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9ydGZvbGlvLXN3aXBlci10d29cIik7XHJcbmlmIChwb3J0Zm9saW8wMikge1xyXG5cdGNvbnN0IHBvcnRmb2xpb1N3aXBlcjAyID0gbmV3IFN3aXBlcignLnBvcnRmb2xpby1zd2lwZXItdHdvJywge1xyXG5cdFx0c3BhY2VCZXR3ZWVuOiAyNSxcclxuXHRcdHdyYXBwZXJDbGFzczogXCJwb3J0Zm9saW8tc3dpcGVyLXdyYXBwZXItdHdvXCIsXHJcblx0XHRzbGlkZUNsYXNzOiBcInBvcnRmb2xpby1zd2lwZXItc2xpZGUtdHdvXCIsXHJcblx0XHRncmFiQ3Vyc29yOiB0cnVlLFxyXG5cdFx0bG9vcDogdHJ1ZSxcclxuXHRcdG9ic2VydmVyOiB0cnVlLFxyXG5cdFx0b2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcblx0XHRzbGlkZXNQZXJWaWV3OiAxLjIsXHJcblx0XHRuYXZpZ2F0aW9uOiB7XHJcblx0XHRcdG5leHRFbDogXCIucG9ydGZvbGlvLWJ1dHRvbl9fbmV4dFwiLFxyXG5cdFx0XHRwcmV2RWw6IFwiLnBvcnRmb2xpby1idXR0b25fX3ByZXZcIixcclxuXHRcdH0sXHJcblx0XHRicmVha3BvaW50czoge1xyXG5cdFx0XHQ1MDA6IHtcclxuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAxLjUsXHJcblx0XHRcdH0sXHJcblx0XHRcdDEwMjQ6IHtcclxuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAyLFxyXG5cdFx0XHRcdHNwYWNlQmV0d2VlbjogMzAsXHJcblx0XHRcdH0sXHJcblx0XHRcdDE0NDA6IHtcclxuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAyLjIsXHJcblx0XHRcdH0sXHJcblx0XHRcdDE5MjA6IHtcclxuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAyLjcsXHJcblx0XHRcdH0sXHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuY29uc3Qgd29ya1N3aXBlcjEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndvcmtfX3N3aXBlci1vbmVcIik7XHJcbmlmICh3b3JrU3dpcGVyMSkge1xyXG5cdGNvbnN0IHdvcmtTd2lwZXIxID0gbmV3IFN3aXBlcignLndvcmtfX3N3aXBlci1vbmUnLCB7XHJcblx0XHRzcGFjZUJldHdlZW46IDMwLFxyXG5cdFx0d3JhcHBlckNsYXNzOiBcIndvcmstc3dpcGVyLXdyYXBwZXItb25lXCIsXHJcblx0XHRzbGlkZUNsYXNzOiBcIndvcmtfX3N3aXBlci1zbGlkZS1vbmVcIixcclxuXHRcdHNsaWRlc1BlclZpZXc6IDQsXHJcblx0XHRsb29wOiB0cnVlLFxyXG5cdFx0c3BlZWQ6IDcwMDAsXHJcblx0XHRhdXRvcGxheToge1xyXG5cdFx0XHRkZWxheTogMCxcclxuXHRcdH0sXHJcblx0XHRicmVha3BvaW50czoge1xyXG5cdFx0XHQ3Njg6IHtcclxuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiA1LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQxMjAwOiB7XHJcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogNixcclxuXHRcdFx0fSxcclxuXHRcdH1cclxuXHR9KVxyXG59XHJcbmNvbnN0IHdvcmtTd2lwZXIyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53b3JrX19zd2lwZXItdHdvXCIpO1xyXG5pZiAod29ya1N3aXBlcjIpIHtcclxuXHRjb25zdCB3b3JrU3dpcGVyMiA9IG5ldyBTd2lwZXIoJy53b3JrX19zd2lwZXItdHdvJywge1xyXG5cdFx0c3BhY2VCZXR3ZWVuOiAzMCxcclxuXHRcdHdyYXBwZXJDbGFzczogXCJ3b3JrLXN3aXBlci13cmFwcGVyLXR3b1wiLFxyXG5cdFx0c2xpZGVDbGFzczogXCJ3b3JrX19zd2lwZXItc2xpZGUtdHdvXCIsXHJcblx0XHRsb29wOiB0cnVlLFxyXG5cdFx0c2xpZGVzUGVyVmlldzogNCxcclxuXHRcdHNwZWVkOiA3MDAwLFxyXG5cdFx0YXV0b3BsYXk6IHtcclxuXHRcdFx0ZGVsYXk6IDAsXHJcblx0XHRcdHJldmVyc2VEaXJlY3Rpb246IHRydWUsXHJcblx0XHR9LFxyXG5cdFx0YnJlYWtwb2ludHM6IHtcclxuXHRcdFx0NzY4OiB7XHJcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogNSxcclxuXHRcdFx0fSxcclxuXHRcdFx0MTIwMDoge1xyXG5cdFx0XHRcdHNsaWRlc1BlclZpZXc6IDYsXHJcblx0XHRcdH0sXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG5cclxuY29uc3QgYWJvdXRTd2lwZXIxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hYm91dF9fc3dpcGVyLW9uZVwiKTtcclxuaWYgKGFib3V0U3dpcGVyMSkge1xyXG5cdGNvbnN0IGFib3V0U3dpcGVyMSA9IG5ldyBTd2lwZXIoJy5hYm91dF9fc3dpcGVyLW9uZScsIHtcclxuXHRcdHNwYWNlQmV0d2VlbjogMTAsXHJcblx0XHR3cmFwcGVyQ2xhc3M6IFwiYWJvdXRfX3N3aXBlci13cmFwcGVyLW9uZVwiLFxyXG5cdFx0c2xpZGVDbGFzczogXCJhYm91dF9fc3dpcGVyLXNsaWRlLW9uZVwiLFxyXG5cdFx0c2xpZGVzUGVyVmlldzogMyxcclxuXHRcdGxvb3A6IHRydWUsXHJcblx0XHRzcGVlZDogNzAwMCxcclxuXHRcdGF1dG9wbGF5OiB7XHJcblx0XHRcdGRlbGF5OiAwXHJcblx0XHR9LFxyXG5cdFx0Zm9sbG93RmluZ2VyOiBmYWxzZSxcclxuXHRcdGJyZWFrcG9pbnRzOiB7XHJcblx0XHRcdDc2ODoge1xyXG5cdFx0XHRcdHNsaWRlc1BlclZpZXc6IDUsXHJcblx0XHRcdFx0c3BhY2VCZXR3ZWVuOiAzMFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQxMjAwOiB7XHJcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogNixcclxuXHRcdFx0XHRzcGFjZUJldHdlZW46IDMwXHJcblx0XHRcdH0sXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG5jb25zdCBhYm91dFN3aXBlcjIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFib3V0X19zd2lwZXItdHdvXCIpO1xyXG5pZiAoYWJvdXRTd2lwZXIyKSB7XHJcblx0Y29uc3QgYWJvdXRTd2lwZXIyID0gbmV3IFN3aXBlcignLmFib3V0X19zd2lwZXItdHdvJywge1xyXG5cdFx0c3BhY2VCZXR3ZWVuOiAxMCxcclxuXHRcdHdyYXBwZXJDbGFzczogXCJhYm91dC1zd2lwZXItd3JhcHBlci10d29cIixcclxuXHRcdHNsaWRlQ2xhc3M6IFwiYWJvdXRfX3N3aXBlci1zbGlkZS10d29cIixcclxuXHRcdGxvb3A6IHRydWUsXHJcblx0XHRzbGlkZXNQZXJWaWV3OiAzLFxyXG5cdFx0c3BlZWQ6IDcwMDAsXHJcblx0XHRhdXRvcGxheToge1xyXG5cdFx0XHRkZWxheTogMCxcclxuXHRcdFx0cmV2ZXJzZURpcmVjdGlvbjogdHJ1ZVxyXG5cdFx0fSxcclxuXHRcdGZvbGxvd0ZpbmdlcjogZmFsc2UsXHJcblx0XHRicmVha3BvaW50czoge1xyXG5cdFx0XHQ3Njg6IHtcclxuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiA1LFxyXG5cdFx0XHRcdHNwYWNlQmV0d2VlbjogMzBcclxuXHRcdFx0fSxcclxuXHRcdFx0MTIwMDoge1xyXG5cdFx0XHRcdHNsaWRlc1BlclZpZXc6IDYsXHJcblx0XHRcdFx0c3BhY2VCZXR3ZWVuOiAzMFxyXG5cdFx0XHR9LFxyXG5cdFx0fVxyXG5cdH0pXHJcbn1cclxuIiwiY29uc3QgdmFsaWRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtdmFsaWRhdGUnKVxyXG5pZiAodmFsaWRhdGUpIHtcclxuICBpZiAodmFsaWRhdGUpIHtcclxuICAgIGNvbnN0IHZhbGlkYXRpb24gPSBuZXcgSnVzdFZhbGlkYXRlKHZhbGlkYXRlKVxyXG4gICAgdmFsaWRhdGlvbi5hZGRGaWVsZCgnI3VzZXItbWFpbCcsIFtcclxuICAgICAge1xyXG4gICAgICAgIHJ1bGU6ICdyZXF1aXJlZCcsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAn0K3Qu9C10LrRgtGA0L7QvdC90LDRjyDQv9C+0YfRgtCwINC+0LHRj9C30LDRgtC10LvRjNC90LAnLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgcnVsZTogJ2VtYWlsJyxcclxuICAgICAgICBlcnJvck1lc3NhZ2U6ICfQrdC70LXQutGC0YDQvtC90L3QsNGPINC/0L7Rh9GC0LAg0L3QtdC00LXQudGB0YLQstC40YLQtdC70YzQvdCwJyxcclxuICAgICAgfSxcclxuICAgIF0pXHJcbiAgfVxyXG5cclxuICBjb25zdCBpbnB1dHNOZXcgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uZXctaW5wdXQnKSlcclxuICBjb25zdCBidXR0b25OZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LW9mZmVyX19idG4nKVxyXG5cclxuICBpbnB1dHNOZXcuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY2hlY2tJbnB1dHMsIGZhbHNlKVxyXG4gIH0pXHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrSW5wdXRzKCkge1xyXG4gICAgICBjb25zdCBlbXB0eSA9IGlucHV0c05ldy5maWx0ZXIoKGUpID0+IHtcclxuICAgICAgICByZXR1cm4gZS52YWx1ZS50cmltKCkgPT09ICcnXHJcbiAgICAgIH0pLmxlbmd0aFxyXG4gICAgICBidXR0b25OZXcuZGlzYWJsZWQgPSBlbXB0eSAhPT0gMFxyXG4gICAgfVxyXG4gIGNoZWNrSW5wdXRzKClcclxuXHJcblxyXG4gIGNvbnN0IGlucHV0RmVlZGJhY2sgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZWVkYmFjay1pbnB1dCcpKVxyXG4gIGNvbnN0IGJ1dHRvbnNGZWVkYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZWVkYmFja19fYnRuJylcclxuXHJcbiAgaW5wdXRGZWVkYmFjay5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBjaGVja0lucHV0LCBmYWxzZSlcclxuICB9KVxyXG4gIC8vIGNvbnN0IGZlZWRiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZlZWRiYWNrLWNvbnNlbnQnKVxyXG4gIC8vIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZlZWRiYWNrLWRldGFpbHNfX2lucHV0JylcclxuXHJcbiAgLy8gZmVlZGJhY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgLy8gICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAvLyAgIGlmIChpbnB1dC5jaGVja2VkKSB7XHJcbiAgLy8gICAgIGlucHV0LmNoZWNrZWQgPSBmYWxzZVxyXG4gIC8vICAgfSBlbHNlIHtcclxuICAvLyAgICAgaW5wdXQuY2hlY2tlZCA9IHRydWVcclxuICAvLyAgIH1cclxuICAvLyB9LCAzMDApO1xyXG4gIC8vIH0pXHJcbiAgY29uc3QgYWdyZWVtZW50Q2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXQtY2hlY2tib3gnKVxyXG4gIGFncmVlbWVudENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2hlY2tJbnB1dClcclxuXHJcbiAgZnVuY3Rpb24gY2hlY2tJbnB1dCgpIHtcclxuICAgIGNvbnN0IGVtcHR5ID0gaW5wdXRGZWVkYmFjay5maWx0ZXIoKGUpID0+IHtcclxuICAgICAgcmV0dXJuIGUudmFsdWUudHJpbSgpID09PSAnJ1xyXG4gICAgfSkubGVuZ3RoXHJcbiAgICBjb25zb2xlLmxvZyhhZ3JlZW1lbnRDaGVja2JveC5jaGVja2VkKVxyXG4gICAgYnV0dG9uc0ZlZWRiYWNrLmRpc2FibGVkID0gZW1wdHkgIT09IDAgfHwgIWFncmVlbWVudENoZWNrYm94LmNoZWNrZWRcclxuICB9XHJcbiAgY2hlY2tJbnB1dCgpXHJcbiAgY29uc3QgdmFsaWRhdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXZhbGlkYXRlcycpXHJcbiAgaWYgKHZhbGlkYXRlcykge1xyXG4gICAgY29uc3QgdmFsaWRhdGlvbiA9IG5ldyBKdXN0VmFsaWRhdGUodmFsaWRhdGVzKVxyXG4gICAgdmFsaWRhdGlvbi5hZGRGaWVsZCgnI3VzZXItbmFtZScsIFtcclxuICAgICAge1xyXG4gICAgICAgIHJ1bGU6ICdyZXF1aXJlZCcsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAn0J/QvtC70LUg0JjQvNGPINC90LUg0LzQvtC20LXRgiDQsdGL0YLRjCDQv9GD0YHRgtGL0LwnLFxyXG4gICAgICB9LFxyXG4gICAgXSksXHJcbiAgICAgIC8vIHZhbGlkYXRpb24uYWRkRmllbGQoJyN1c2VyLXBob25lJywgW1xyXG4gICAgICAvLyAgIHtcclxuICAgICAgLy8gICAgIHJ1bGU6ICdjdXN0b21SZWdleHAnLFxyXG4gICAgICAvLyAgICAgdmFsdWU6IC8oKFxcKzd8N3w4KSsoWzAtOV0pezEwfSkkLyxcclxuICAgICAgLy8gICAgIGVycm9yTWVzc2FnZTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQvdC+0LzQtdGAINGC0LXQu9C10YTQvtC90LAnLFxyXG4gICAgICAvLyAgIH0sXHJcbiAgICAgIC8vIF0pLFxyXG4gICAgICB2YWxpZGF0aW9uLmFkZEZpZWxkKCcjaW5wdXQtY2hlY2tib3gnLCBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcnVsZTogJ3JlcXVpcmVkJyxcclxuICAgICAgICAgIGVycm9yTWVzc2FnZTogJ9Ch0L7Qs9C70LDRgdC40LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQv9GA0Lgg0L7RgtC/0YDQsNCy0LrQtSDQtNCw0L3QvdGL0YUhJyxcclxuICAgICAgICB9LFxyXG4gICAgICBdKVxyXG4gIH1cclxufVxyXG4iXX0=
