'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const slides = document.querySelectorAll('.slide');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

// const h1 = document.querySelector('h1');

// h1.closest('.header').style.backgroundColor = 'var(--color-secondary-darker)';

// h1.firstElementChild.style.color = 'var(--color-tertiary-darker)';

// h1.lastElementChild.style.color = 'var(--color-primary-darker)';
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const dotsContainer = document.querySelector('.dots');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
let dots;
const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"> </button>`
    );
  });
  dots = document.querySelectorAll('.dots__dot');

  dots[0].style.backgroundColor = 'black';
};
createDots();
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  [...clicked.parentElement.children].forEach(child =>
    child.classList.remove('operations__tab--active')
  );
  clicked.classList.add('operations__tab--active');
  console.log(clicked);

  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    console.log(siblings);
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      if (sibling !== link) {
        sibling.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });

  console.log(entries);
};

const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const ObsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px 0px 0px 0px`,
};

const headerObserver = new IntersectionObserver(stickyNav, ObsOptions);

headerObserver.observe(header);

const sections = document.querySelectorAll('.section');

const sectionCallback = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
  });
};

const sectionObserver = new IntersectionObserver(sectionCallback, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});
const imgs = document.querySelectorAll('img[data-src]');
const imgCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgs.forEach(img => {
  imgObserver.observe(img);
});

const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
let slidesLength = slides.length;
const changeColor = function (slideIndex) {
  dots.forEach(dot => {
    dot.style.backgroundColor = '#b9b9b9';
  });

  const activeDot = document.querySelector(
    `.dots__dot[data-slide="${slideIndex}"]`
  );
  activeDot.style.backgroundColor = 'black';
};

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });

  changeColor(slide);
};

goToSlide(0);
const nextSlide = function () {
  if (curSlide === slidesLength - 1) {
    curSlide = -1;
  }
  curSlide++;
  goToSlide(curSlide);
};

const previousSlide = function () {
  if (curSlide === 0) {
    curSlide = slidesLength;
  }
  curSlide--;

  goToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    previousSlide(curSlide);
  } else if (e.key === 'ArrowRight') {
    nextSlide(curSlide);
  }
});

const changeSlide = function (changeTo) {
  console.log(changeTo);
};

dotsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  goToSlide(Number(e.target.dataset.slide));
});
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// window.addEventListener('scroll', function (e) {
//   if (
//     window.scrollX <=
//     document.querySelector('#section--1').getBoundingClientRect().top
//   ) {
//     nav.classList.remove('sticky');
//   } else {
//     nav.classList.add('sticky');
//   }
// });
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const coord = document
//       .querySelector(this.getAttribute('href'))
//       .getBoundingClientRect();
//     window.scrollTo({
//       behavior: 'smooth',
//       left: window.scrollX + coord.left,
//       top: window.scrollY + coord.top,
//     });
//   });
// });

// const message = document.createElement('div');
// message.classList.add('cookie-message');

// message.innerHTML = `We use cookied for improved functionality and analytics, <button class="btn btn--close-cookie">Got it!</button>`;

// header.prepend(message);
// header.after(message.cloneNode());
// header.append(message);

// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   message.parentElement.removeChild(message);
// });

// message.style.backgroundColor = 'grey';
// message.style.width = '120%';

// console.log(message.style.backgroundColor);
// console.log(message.style.color);
// console.log(getComputedStyle(message).color);

// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

// console.log(message.style.message);

// const btnScrollTo = document.querySelector('.btn--scroll-to');

// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', e => {
//   const s1cords = section1.getBoundingClientRect();
//   console.log(e.target.getBoundingClientRect());

//   console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);

//   console.log(
//     'height/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );

//   // window.scrollTo(window.scrollX + s1cords.left, window.scrollY + s1cords.top);

//   window.scrollTo({
//     top: window.scrollY + s1cords.top,
//     left: window.scrollX + s1cords.left,
//     behavior: 'smooth',
//   });

//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// const h1 = document.querySelector('h1');

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () => {
//   return `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(
//     0,
//     255
//   )})`;
// };
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });
