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
