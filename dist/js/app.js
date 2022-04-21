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

          if (e.target.closest(".modal-close")) {
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
if(portfolio01){
const portfolioSwiper01 = new Swiper('.portfolio-swiper-one', {
  spaceBetween: 25,
  wrapperClass: "portfolio-swiper-wrapper-one",
  slideClass: "portfolio-swiper-slide-one",
  loop: true,
  grabCursor: true,
  observer: true,
  observeParents: true,
  slidesPerView:1.2,

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
if(portfolio02 ){
const portfolioSwiper02 = new Swiper('.portfolio-swiper-two', {
  spaceBetween: 25,
  wrapperClass: "portfolio-swiper-wrapper-two",
  slideClass: "portfolio-swiper-slide-two",
  grabCursor: true,
  loop: true,
  observer: true,
  observeParents: true,
  slidesPerView:1.2,
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
if(workSwiper1 ){
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
if(workSwiper2 ){
  const workSwiper2 = new Swiper('.work__swiper-two', {
  spaceBetween: 30,
  wrapperClass: "work-swiper-wrapper-two",
  slideClass: "work__swiper-slide-two",
  loop: true,
  slidesPerView: 4,
  speed: 7000,
  autoplay: {
    delay: 0,
    reverseDirection:true,
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
if(aboutSwiper1 ){
  const aboutSwiper1  = new Swiper('.about__swiper-one', {
  spaceBetween: 10,
  wrapperClass: "about__swiper-wrapper-one",
  slideClass: "about__swiper-slide-one",
  slidesPerView: 3,
  loop: true,
  speed: 10000,
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
const aboutSwiper2 = document.querySelector(".about__swiper-two");
if(aboutSwiper2 ){
  const aboutSwiper2 = new Swiper('.about__swiper-two', {
  spaceBetween: 10,
  wrapperClass: "about-swiper-wrapper-two",
  slideClass: "about__swiper-slide-two",
  loop: true,
  slidesPerView: 3,
  speed: 10000,
  autoplay: {
    delay: 0,
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
    validation.addField('#recipient_email', [
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwibGF6eS1sb2FkLmpzIiwibWVudS5qcyIsIm1vZGFsLmpzIiwic3dpcGVycy5qcyIsInZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiOygoKSA9PiB7XHJcbiAgZnVuY3Rpb24gb25FbnRyeShlbnRyeSkge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gMTAwMCkge1xyXG4gICAgICBlbnRyeS5mb3JFYWNoKChjaGFuZ2UpID0+IHtcclxuICAgICAgICBpZiAoY2hhbmdlLmlzSW50ZXJzZWN0aW5nKSB7XHJcbiAgICAgICAgICBjaGFuZ2UudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2VsZW1lbnQtc2hvdycpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgb3B0aW9ucyA9IHsgdGhyZXNob2xkOiBbMC41XSB9XHJcbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIob25FbnRyeSwgb3B0aW9ucylcclxuICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5lbGVtZW50LWFuaW1hdGlvbicpXHJcbiAgZm9yIChjb25zdCBlbG0gb2YgZWxlbWVudHMpIHtcclxuICAgIG9ic2VydmVyLm9ic2VydmUoZWxtKVxyXG4gIH1cclxufSkoKVxyXG5cclxuXHJcbmNvbnN0IHNtb290aExpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXj1cIiNcIl0nKVxyXG5mb3IgKGxldCBzbW9vdGhMaW5rIG9mIHNtb290aExpbmtzKSB7XHJcbiAgc21vb3RoTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sZXR0ZXJpbmdfX2xpc3QnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUtYnVyZ2VyJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICB9KVxyXG59XHJcblxyXG4iLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PntcclxuICBjb25zdCBsYXp5TG9hZFZpZGVvcyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInZpZGVvLmxhenktdmlkZW9cIikpO1xyXG4gICBpZiAoXCJJbnRlcnNlY3Rpb25PYnNlcnZlclwiIGluIHdpbmRvdykge1xyXG4gICAgY29uc3QgbGF6eVZpZGVvT2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMsIG9ic2VydmVyKT0+IHtcclxuICAgICBlbnRyaWVzLmZvckVhY2goKHZpZGVvKT0+e1xyXG4gICAgICBpZiAodmlkZW8uaXNJbnRlcnNlY3RpbmcpIHtcclxuICAgICAgIGZvciAoY29uc3Qgc291cmNlIGluIHZpZGVvLnRhcmdldC5jaGlsZHJlbikge1xyXG4gICAgICAgY29uc3QgdmlkZW9Tb3VyY2UgPSB2aWRlby50YXJnZXQuY2hpbGRyZW5bc291cmNlXTtcclxuICAgICAgICBpZiAodHlwZW9mIHZpZGVvU291cmNlLnRhZ05hbWUgPT09IFwic3RyaW5nXCIgJiYgdmlkZW9Tb3VyY2UudGFnTmFtZSA9PT0gXCJTT1VSQ0VcIikge1xyXG4gICAgICAgICB2aWRlb1NvdXJjZS5zcmMgPSB2aWRlb1NvdXJjZS5kYXRhc2V0LnNyYztcclxuICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICB2aWRlby50YXJnZXQubG9hZCgpO1xyXG4gICAgICAgdmlkZW8udGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJsYXp5LXZpZGVvXCIpO1xyXG4gICAgICAgbGF6eVZpZGVvT2JzZXJ2ZXIudW5vYnNlcnZlKHZpZGVvLnRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgbGF6eUxvYWRWaWRlb3MuZm9yRWFjaCgobGF6eVZpZGVvKT0+IHtcclxuICAgICBsYXp5VmlkZW9PYnNlcnZlci5vYnNlcnZlKGxhenlWaWRlbyk7XHJcbiAgICB9KTtcclxuICAgfVxyXG4gfSk7IiwiXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1idXJnZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKCkgPT4ge1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1idXJnZXJcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxldHRlcmluZ19fbGlzdFwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIpO1xyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgbGV0IHZoID0gd2luZG93LnZpc3VhbFZpZXdwb3J0LmhlaWdodCAqIDAuMDE7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sZXR0ZXJpbmdfX2xpc3RcIikuc3R5bGUuc2V0UHJvcGVydHkoJy0tdmgnLCBgJHt2aH1weGApO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHJlbW92ZU1lbnUoKSB7XHJcbiAgbGV0IHNjcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuICBpZiAoc2Nyb2xsID4gMzAwKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxldHRlcmluZ19fbGlzdFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWJ1cmdlclwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gIH1cclxufVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcmVtb3ZlTWVudSwgdHJ1ZSk7IiwiY29uc3QgZml4QmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZpeC1ibG9jaycpO1xyXG5jb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuY2xhc3MgTW9kYWwge1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIGxldCBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgaXNPcGVuOiAoKSA9PiB7fSxcclxuICAgICAgaXNDbG9zZTogKCkgPT4ge30sXHJcbiAgICB9O1xyXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWxcIik7XHJcbiAgICAgIHRoaXMubW9kYWwgPSBtb2RhbDtcclxuICAgIHRoaXMuc3BlZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuYW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xyXG4gICAgdGhpcy5tb2RhbENvbnRhaW5lciA9IGZhbHNlO1xyXG4gICAgdGhpcy5wcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmZvY3VzRWxlbWVudHMgPSBbXHJcbiAgICAgIFwiYVtocmVmXVwiLFxyXG4gICAgICBcImlucHV0XCIsXHJcbiAgICAgIFwiYnV0dG9uXCIsXHJcbiAgICAgIFwic2VsZWN0XCIsXHJcbiAgICAgIFwidGV4dGFyZWFcIixcclxuICAgICAgXCJbdGFiaW5kZXhdXCIsXHJcbiAgICBdO1xyXG4gICAgdGhpcy5ldmVudHMoKTtcclxuICB9XHJcblxyXG4gIGV2ZW50cygpIHtcclxuICAgIGlmICh0aGlzLm1vZGFsKSB7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgXCJjbGlja1wiLFxyXG4gICAgICAgIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBjb25zdCBjbGlja2VkRWxlbWVudCA9IGUudGFyZ2V0LmNsb3Nlc3QoXCJbZGF0YS1wYXRoXVwiKTtcclxuICAgICAgICAgIGlmIChjbGlja2VkRWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gY2xpY2tlZEVsZW1lbnQuZGF0YXNldC5wYXRoO1xyXG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uID0gY2xpY2tlZEVsZW1lbnQuZGF0YXNldC5hbmltYXRpb247XHJcbiAgICAgICAgICAgIGxldCBzcGVlZCA9IGNsaWNrZWRFbGVtZW50LmRhdGFzZXQuc3BlZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbWF0aW9uID8gYW5pbWF0aW9uIDogXCJmYWRlXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZCA/IHBhcnNlSW50KHNwZWVkKSA6IDMwMDtcclxuICAgICAgICAgICAgdGhpcy5tb2RhbENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgYFtkYXRhLXRhcmdldD1cIiR7dGFyZ2V0fVwiXWBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdChcIi5tb2RhbC1jbG9zZVwiKSkge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwia2V5ZG93blwiLFxyXG4gICAgICAgIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDI3KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzT3Blbikge1xyXG4gICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gOSAmJiB0aGlzLmlzT3Blbikge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzQ2F0Y2goZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHRoaXMubW9kYWwuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICBcImNsaWNrXCIsXHJcbiAgICAgICAgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIm1vZGFsLWNhcmRcIikgJiZcclxuICAgICAgICAgICAgIWUudGFyZ2V0LmNsb3Nlc3QoXCIubW9kYWwtY2FyZFwiKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmlzT3BlblxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9wZW4oKSB7XHJcbiAgICB0aGlzLnByZXZpb3VzQWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5tb2RhbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tdHJhbnNpdGlvbi10aW1lXCIsIGAke3RoaXMuc3BlZWQgLyAxMDAwfXNgKTtcclxuICAgIHRoaXMubW9kYWwuY2xhc3NMaXN0LmFkZChcImlzLW9wZW5cIik7XHJcbiAgICB0aGlzLmRpc2FibGVTY3JvbGwoKTtcclxuXHJcbiAgICB0aGlzLm1vZGFsQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1vcGVuXCIpO1xyXG4gICAgdGhpcy5tb2RhbENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuYW5pbWF0aW9uKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5vcHRpb25zLmlzT3Blbih0aGlzKTtcclxuICAgICAgdGhpcy5tb2RhbENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYW5pbWF0ZS1vcGVuXCIpO1xyXG4gICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XHJcbiAgICAgIHRoaXMuZm9jdXNUcmFwKCk7XHJcbiAgICB9LCB0aGlzLnNwZWVkKTtcclxuICB9XHJcblxyXG4gIGNsb3NlKCkge1xyXG4gICAgaWYgKHRoaXMubW9kYWxDb250YWluZXIpIHtcclxuICAgICAgdGhpcy5tb2RhbENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiYW5pbWF0ZS1vcGVuXCIpO1xyXG4gICAgICB0aGlzLm1vZGFsQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5hbmltYXRpb24pO1xyXG4gICAgICB0aGlzLm1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1vcGVuXCIpO1xyXG4gICAgICB0aGlzLm1vZGFsQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1vcGVuXCIpO1xyXG4gICAgICB0aGlzLmVuYWJsZVNjcm9sbCgpO1xyXG4gICAgICB0aGlzLm9wdGlvbnMuaXNDbG9zZSh0aGlzKTtcclxuICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcclxuICAgICAgdGhpcy5mb2N1c1RyYXAoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvY3VzQ2F0Y2goZSkge1xyXG4gICAgY29uc3QgZm9jdXNhYmxlID0gdGhpcy5tb2RhbENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuZm9jdXNFbGVtZW50cyk7XHJcbiAgICBjb25zdCBmb2N1c0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZm9jdXNhYmxlKTtcclxuICAgIGNvbnN0IGZvY3VzZWRJbmRleCA9IGZvY3VzQXJyYXkuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuXHJcbiAgICBpZiAoZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IDApIHtcclxuICAgICAgZm9jdXNBcnJheVtmb2N1c0FycmF5Lmxlbmd0aCAtIDFdLmZvY3VzKCk7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSBmb2N1c0FycmF5Lmxlbmd0aCAtIDEpIHtcclxuICAgICAgZm9jdXNBcnJheVswXS5mb2N1cygpO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb2N1c1RyYXAoKSB7XHJcbiAgICBjb25zdCBmb2N1c2FibGUgPSB0aGlzLm1vZGFsQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5mb2N1c0VsZW1lbnRzKTtcclxuICAgIGlmICh0aGlzLmlzT3Blbikge1xyXG4gICAgICBmb2N1c2FibGVbMF0uZm9jdXMoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucHJldmlvdXNBY3RpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlU2Nyb2xsKCkge1xyXG4gICAgbGV0IHBhZGRpbmdPZmZzZXQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGggKyAncHgnO1xyXG4gICAgbGV0IHBhZ2VQb3NpdGlvbiA9IHdpbmRvdy5zY3JvbGxZO1xyXG4gICAgZml4QmxvY2tzLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgIGVsLnN0eWxlLnBhZGRpbmdSaWdodCA9IHBhZGRpbmdPZmZzZXQ7XHJcbiAgICB9KTtcclxuICAgIGJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZ09mZnNldDtcclxuICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZS1zY3JvbGwnKTtcclxuICAgIGJvZHkuZGF0YXNldC5wb3NpdGlvbiA9IHBhZ2VQb3NpdGlvbjtcclxuICAgIGJvZHkuc3R5bGUudG9wID0gLXBhZ2VQb3NpdGlvbiArICdweCc7XHJcbiAgfVxyXG4gIFxyXG4gIGVuYWJsZVNjcm9sbCgpIHtcclxuICAgIGxldCBwYWdlUG9zaXRpb24gPSBwYXJzZUludChkb2N1bWVudC5ib2R5LmRhdGFzZXQucG9zaXRpb24sIDEwKTtcclxuICAgIGJvZHkuc3R5bGUudG9wID0gJ2F1dG8nO1xyXG4gICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlLXNjcm9sbCcpO1xyXG4gICAgZml4QmxvY2tzLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgIGVsLnN0eWxlLnBhZGRpbmdSaWdodCA9ICcwcHgnO1xyXG4gICAgfSk7XHJcbiAgICBib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcwcHgnO1xyXG4gICAgd2luZG93LnNjcm9sbCh7dG9wOiBwYWdlUG9zaXRpb24sIGxlZnQ6IDB9KTtcclxuICAgIGJvZHkucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXBvc2l0aW9uJyk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBtb2RhbCA9IG5ldyBNb2RhbCgpOyIsImNvbnN0IHBvcnRmb2xpbzAxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3J0Zm9saW8tc3dpcGVyLW9uZVwiKTtcclxuaWYocG9ydGZvbGlvMDEpe1xyXG5jb25zdCBwb3J0Zm9saW9Td2lwZXIwMSA9IG5ldyBTd2lwZXIoJy5wb3J0Zm9saW8tc3dpcGVyLW9uZScsIHtcclxuICBzcGFjZUJldHdlZW46IDI1LFxyXG4gIHdyYXBwZXJDbGFzczogXCJwb3J0Zm9saW8tc3dpcGVyLXdyYXBwZXItb25lXCIsXHJcbiAgc2xpZGVDbGFzczogXCJwb3J0Zm9saW8tc3dpcGVyLXNsaWRlLW9uZVwiLFxyXG4gIGxvb3A6IHRydWUsXHJcbiAgZ3JhYkN1cnNvcjogdHJ1ZSxcclxuICBvYnNlcnZlcjogdHJ1ZSxcclxuICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICBzbGlkZXNQZXJWaWV3OjEuMixcclxuXHJcbiAgbmF2aWdhdGlvbjoge1xyXG4gICAgbmV4dEVsOiBcIi5wb3J0Zm9saW8tYnV0dG9uX19uZXh0XCIsXHJcbiAgICBwcmV2RWw6IFwiLnBvcnRmb2xpby1idXR0b25fX3ByZXZcIixcclxuICB9LFxyXG4gIGJyZWFrcG9pbnRzOiB7XHJcbiAgICA1MDA6IHtcclxuICAgICAgc2xpZGVzUGVyVmlldzogMS41LFxyXG4gICAgfSxcclxuICAgIDEwMjQ6IHtcclxuICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgc3BhY2VCZXR3ZWVuOiAzMCxcclxuICAgIH0sXHJcbiAgICAxNDQwOiB7XHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDIuMixcclxuICAgIH0sXHJcbiAgICAxOTIwOiB7XHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDIuNyxcclxuICAgIH0sXHJcbiAgfVxyXG59KTtcclxufVxyXG5cclxuY29uc3QgcG9ydGZvbGlvMDIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcnRmb2xpby1zd2lwZXItdHdvXCIpO1xyXG5pZihwb3J0Zm9saW8wMiApe1xyXG5jb25zdCBwb3J0Zm9saW9Td2lwZXIwMiA9IG5ldyBTd2lwZXIoJy5wb3J0Zm9saW8tc3dpcGVyLXR3bycsIHtcclxuICBzcGFjZUJldHdlZW46IDI1LFxyXG4gIHdyYXBwZXJDbGFzczogXCJwb3J0Zm9saW8tc3dpcGVyLXdyYXBwZXItdHdvXCIsXHJcbiAgc2xpZGVDbGFzczogXCJwb3J0Zm9saW8tc3dpcGVyLXNsaWRlLXR3b1wiLFxyXG4gIGdyYWJDdXJzb3I6IHRydWUsXHJcbiAgbG9vcDogdHJ1ZSxcclxuICBvYnNlcnZlcjogdHJ1ZSxcclxuICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICBzbGlkZXNQZXJWaWV3OjEuMixcclxuICBuYXZpZ2F0aW9uOiB7XHJcbiAgICBuZXh0RWw6IFwiLnBvcnRmb2xpby1idXR0b25fX25leHRcIixcclxuICAgIHByZXZFbDogXCIucG9ydGZvbGlvLWJ1dHRvbl9fcHJldlwiLFxyXG4gIH0sXHJcbiAgYnJlYWtwb2ludHM6IHtcclxuICA1MDA6IHtcclxuICAgIHNsaWRlc1BlclZpZXc6IDEuNSxcclxuICB9LFxyXG4gIDEwMjQ6IHtcclxuICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICBzcGFjZUJldHdlZW46IDMwLFxyXG4gIH0sXHJcbiAgMTQ0MDoge1xyXG4gICAgc2xpZGVzUGVyVmlldzogMi4yLFxyXG4gIH0sXHJcbiAgMTkyMDoge1xyXG4gICAgc2xpZGVzUGVyVmlldzogMi43LFxyXG4gIH0sXHJcbn1cclxufSk7XHJcbn1cclxuY29uc3Qgd29ya1N3aXBlcjEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndvcmtfX3N3aXBlci1vbmVcIik7XHJcbmlmKHdvcmtTd2lwZXIxICl7XHJcbiAgY29uc3Qgd29ya1N3aXBlcjEgPSBuZXcgU3dpcGVyKCcud29ya19fc3dpcGVyLW9uZScsIHtcclxuICBzcGFjZUJldHdlZW46IDMwLFxyXG4gIHdyYXBwZXJDbGFzczogXCJ3b3JrLXN3aXBlci13cmFwcGVyLW9uZVwiLFxyXG4gIHNsaWRlQ2xhc3M6IFwid29ya19fc3dpcGVyLXNsaWRlLW9uZVwiLFxyXG4gIHNsaWRlc1BlclZpZXc6IDQsXHJcbiAgbG9vcDogdHJ1ZSxcclxuICBzcGVlZDogNzAwMCxcclxuICBhdXRvcGxheToge1xyXG4gICAgZGVsYXk6IDAsXHJcbiAgfSxcclxuICBicmVha3BvaW50czoge1xyXG4gIDc2ODoge1xyXG4gICAgc2xpZGVzUGVyVmlldzogNSxcclxuICB9LFxyXG4gIDEyMDA6IHtcclxuICAgIHNsaWRlc1BlclZpZXc6IDYsXHJcbiAgfSxcclxufVxyXG59KVxyXG59XHJcbmNvbnN0IHdvcmtTd2lwZXIyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53b3JrX19zd2lwZXItdHdvXCIpO1xyXG5pZih3b3JrU3dpcGVyMiApe1xyXG4gIGNvbnN0IHdvcmtTd2lwZXIyID0gbmV3IFN3aXBlcignLndvcmtfX3N3aXBlci10d28nLCB7XHJcbiAgc3BhY2VCZXR3ZWVuOiAzMCxcclxuICB3cmFwcGVyQ2xhc3M6IFwid29yay1zd2lwZXItd3JhcHBlci10d29cIixcclxuICBzbGlkZUNsYXNzOiBcIndvcmtfX3N3aXBlci1zbGlkZS10d29cIixcclxuICBsb29wOiB0cnVlLFxyXG4gIHNsaWRlc1BlclZpZXc6IDQsXHJcbiAgc3BlZWQ6IDcwMDAsXHJcbiAgYXV0b3BsYXk6IHtcclxuICAgIGRlbGF5OiAwLFxyXG4gICAgcmV2ZXJzZURpcmVjdGlvbjp0cnVlLFxyXG4gIH0sXHJcbiAgYnJlYWtwb2ludHM6IHtcclxuICA3Njg6IHtcclxuICAgIHNsaWRlc1BlclZpZXc6IDUsXHJcbiAgfSxcclxuICAxMjAwOiB7XHJcbiAgICBzbGlkZXNQZXJWaWV3OiA2LFxyXG4gIH0sXHJcbn1cclxufSlcclxufVxyXG5cclxuY29uc3QgYWJvdXRTd2lwZXIxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hYm91dF9fc3dpcGVyLW9uZVwiKTtcclxuaWYoYWJvdXRTd2lwZXIxICl7XHJcbiAgY29uc3QgYWJvdXRTd2lwZXIxICA9IG5ldyBTd2lwZXIoJy5hYm91dF9fc3dpcGVyLW9uZScsIHtcclxuICBzcGFjZUJldHdlZW46IDEwLFxyXG4gIHdyYXBwZXJDbGFzczogXCJhYm91dF9fc3dpcGVyLXdyYXBwZXItb25lXCIsXHJcbiAgc2xpZGVDbGFzczogXCJhYm91dF9fc3dpcGVyLXNsaWRlLW9uZVwiLFxyXG4gIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgbG9vcDogdHJ1ZSxcclxuICBzcGVlZDogMTAwMDAsXHJcbiAgYXV0b3BsYXk6IHtcclxuICAgIGRlbGF5OiAwLFxyXG4gICAgcmV2ZXJzZURpcmVjdGlvbjogdHJ1ZVxyXG4gIH0sXHJcbiAgICBmb2xsb3dGaW5nZXI6IGZhbHNlLFxyXG4gIGJyZWFrcG9pbnRzOiB7XHJcbiAgNzY4OiB7XHJcbiAgICBzbGlkZXNQZXJWaWV3OiA1LFxyXG4gICAgc3BhY2VCZXR3ZWVuOiAzMFxyXG4gIH0sXHJcbiAgMTIwMDoge1xyXG4gICAgc2xpZGVzUGVyVmlldzogNixcclxuICAgIHNwYWNlQmV0d2VlbjogMzBcclxuICB9LFxyXG59XHJcbn0pXHJcbn1cclxuY29uc3QgYWJvdXRTd2lwZXIyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hYm91dF9fc3dpcGVyLXR3b1wiKTtcclxuaWYoYWJvdXRTd2lwZXIyICl7XHJcbiAgY29uc3QgYWJvdXRTd2lwZXIyID0gbmV3IFN3aXBlcignLmFib3V0X19zd2lwZXItdHdvJywge1xyXG4gIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgd3JhcHBlckNsYXNzOiBcImFib3V0LXN3aXBlci13cmFwcGVyLXR3b1wiLFxyXG4gIHNsaWRlQ2xhc3M6IFwiYWJvdXRfX3N3aXBlci1zbGlkZS10d29cIixcclxuICBsb29wOiB0cnVlLFxyXG4gIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgc3BlZWQ6IDEwMDAwLFxyXG4gIGF1dG9wbGF5OiB7XHJcbiAgICBkZWxheTogMCxcclxuICB9LFxyXG4gICAgZm9sbG93RmluZ2VyOiBmYWxzZSxcclxuICBicmVha3BvaW50czoge1xyXG4gIDc2ODoge1xyXG4gICAgc2xpZGVzUGVyVmlldzogNSxcclxuICAgIHNwYWNlQmV0d2VlbjogMzBcclxuICB9LFxyXG4gIDEyMDA6IHtcclxuICAgIHNsaWRlc1BlclZpZXc6IDYsXHJcbiAgICBzcGFjZUJldHdlZW46IDMwXHJcbiAgfSxcclxufVxyXG59KVxyXG59XHJcbiIsImNvbnN0IHZhbGlkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXZhbGlkYXRlJylcclxuaWYgKHZhbGlkYXRlKSB7XHJcbiAgaWYgKHZhbGlkYXRlKSB7XHJcbiAgICBjb25zdCB2YWxpZGF0aW9uID0gbmV3IEp1c3RWYWxpZGF0ZSh2YWxpZGF0ZSlcclxuICAgIHZhbGlkYXRpb24uYWRkRmllbGQoJyNyZWNpcGllbnRfZW1haWwnLCBbXHJcbiAgICAgIHtcclxuICAgICAgICBydWxlOiAncmVxdWlyZWQnLFxyXG4gICAgICAgIGVycm9yTWVzc2FnZTogJ9Ct0LvQtdC60YLRgNC+0L3QvdCw0Y8g0L/QvtGH0YLQsCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdCwJyxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHJ1bGU6ICdlbWFpbCcsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAn0K3Qu9C10LrRgtGA0L7QvdC90LDRjyDQv9C+0YfRgtCwINC90LXQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QsCcsXHJcbiAgICAgIH0sXHJcbiAgICBdKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaW5wdXRzTmV3ID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmV3LWlucHV0JykpXHJcbiAgY29uc3QgYnV0dG9uTmV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1vZmZlcl9fYnRuJylcclxuXHJcbiAgaW5wdXRzTmV3LmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGNoZWNrSW5wdXRzLCBmYWxzZSlcclxuICB9KVxyXG5cclxuICBmdW5jdGlvbiBjaGVja0lucHV0cygpIHtcclxuICAgICAgY29uc3QgZW1wdHkgPSBpbnB1dHNOZXcuZmlsdGVyKChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGUudmFsdWUudHJpbSgpID09PSAnJ1xyXG4gICAgICB9KS5sZW5ndGhcclxuICAgICAgYnV0dG9uTmV3LmRpc2FibGVkID0gZW1wdHkgIT09IDBcclxuICAgIH1cclxuICBjaGVja0lucHV0cygpXHJcblxyXG5cclxuICBjb25zdCBpbnB1dEZlZWRiYWNrID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmVlZGJhY2staW5wdXQnKSlcclxuICBjb25zdCBidXR0b25zRmVlZGJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmVlZGJhY2tfX2J0bicpXHJcblxyXG4gIGlucHV0RmVlZGJhY2suZm9yRWFjaCgoZWwpID0+IHtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY2hlY2tJbnB1dCwgZmFsc2UpXHJcbiAgfSlcclxuICAvLyBjb25zdCBmZWVkYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZWVkYmFjay1jb25zZW50JylcclxuICAvLyBjb25zdCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZWVkYmFjay1kZXRhaWxzX19pbnB1dCcpXHJcblxyXG4gIC8vIGZlZWRiYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIC8vICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgLy8gICBpZiAoaW5wdXQuY2hlY2tlZCkge1xyXG4gIC8vICAgICBpbnB1dC5jaGVja2VkID0gZmFsc2VcclxuICAvLyAgIH0gZWxzZSB7XHJcbiAgLy8gICAgIGlucHV0LmNoZWNrZWQgPSB0cnVlXHJcbiAgLy8gICB9XHJcbiAgLy8gfSwgMzAwKTtcclxuICAvLyB9KVxyXG4gIGNvbnN0IGFncmVlbWVudENoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2lucHV0LWNoZWNrYm94JylcclxuICBhZ3JlZW1lbnRDaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNoZWNrSW5wdXQpXHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrSW5wdXQoKSB7XHJcbiAgICBjb25zdCBlbXB0eSA9IGlucHV0RmVlZGJhY2suZmlsdGVyKChlKSA9PiB7XHJcbiAgICAgIHJldHVybiBlLnZhbHVlLnRyaW0oKSA9PT0gJydcclxuICAgIH0pLmxlbmd0aFxyXG4gICAgY29uc29sZS5sb2coYWdyZWVtZW50Q2hlY2tib3guY2hlY2tlZClcclxuICAgIGJ1dHRvbnNGZWVkYmFjay5kaXNhYmxlZCA9IGVtcHR5ICE9PSAwIHx8ICFhZ3JlZW1lbnRDaGVja2JveC5jaGVja2VkXHJcbiAgfVxyXG4gIGNoZWNrSW5wdXQoKVxyXG4gIGNvbnN0IHZhbGlkYXRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy12YWxpZGF0ZXMnKVxyXG4gIGlmICh2YWxpZGF0ZXMpIHtcclxuICAgIGNvbnN0IHZhbGlkYXRpb24gPSBuZXcgSnVzdFZhbGlkYXRlKHZhbGlkYXRlcylcclxuICAgIHZhbGlkYXRpb24uYWRkRmllbGQoJyN1c2VyLW5hbWUnLCBbXHJcbiAgICAgIHtcclxuICAgICAgICBydWxlOiAncmVxdWlyZWQnLFxyXG4gICAgICAgIGVycm9yTWVzc2FnZTogJ9Cf0L7Qu9C1INCY0LzRjyDQvdC1INC80L7QttC10YIg0LHRi9GC0Ywg0L/Rg9GB0YLRi9C8JyxcclxuICAgICAgfSxcclxuICAgIF0pLFxyXG4gICAgICAvLyB2YWxpZGF0aW9uLmFkZEZpZWxkKCcjdXNlci1waG9uZScsIFtcclxuICAgICAgLy8gICB7XHJcbiAgICAgIC8vICAgICBydWxlOiAnY3VzdG9tUmVnZXhwJyxcclxuICAgICAgLy8gICAgIHZhbHVlOiAvKChcXCs3fDd8OCkrKFswLTldKXsxMH0pJC8sXHJcbiAgICAgIC8vICAgICBlcnJvck1lc3NhZ2U6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L3QvtC80LXRgCDRgtC10LvQtdGE0L7QvdCwJyxcclxuICAgICAgLy8gICB9LFxyXG4gICAgICAvLyBdKSxcclxuICAgICAgdmFsaWRhdGlvbi5hZGRGaWVsZCgnI2lucHV0LWNoZWNrYm94JywgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHJ1bGU6ICdyZXF1aXJlZCcsXHJcbiAgICAgICAgICBlcnJvck1lc3NhZ2U6ICfQodC+0LPQu9Cw0YHQuNC1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0L/RgNC4INC+0YLQv9GA0LDQstC60LUg0LTQsNC90L3Ri9GFIScsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSlcclxuICB9XHJcbn1cclxuIl19
