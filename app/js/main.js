$(function () {

  const LS = localStorage;

  function getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    return {
      'total': t,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function initializeClock(id, endtime) {
    LS.setItem('endtime', endtime);
    let clock = document.getElementById(id);
    let minutesSpan = clock.querySelector('.minutes');
    let secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
      let t = getTimeRemaining(endtime);

      secondsSpan.innerHTML = ('0' + t.seconds).slice(+1);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(+1);

      if (t.total <= 0) {
        clearInterval(timeinterval);
        $('.quiz-item14').hide();
        currentSlide++;
        $('.quiz-item' + currentSlide).css('display', 'flex');
      }
    }

    updateClock();
    let timeinterval = setInterval(updateClock, 1000);
  }

  let currentSlide = parseInt(LS.getItem('slide')) || 1;

  if (currentSlide === 14) {
    let deadline = Date.parse(LS.getItem('endtime'));
    if (Date.now() > deadline) {
      currentSlide++;
      LS.removeItem('slide');
      LS.removeItem('quizData');
      LS.removeItem('endtime');
    } else {
      initializeClock('timer', new Date(deadline));
    }
  }
  $('.quiz__item').hide();
  $('.quiz-item' + currentSlide).css('display', 'flex');

  let gender = '';
  let age = 0;

  const otherAnswer = document.querySelectorAll('.quiz__answer-other');
  otherAnswer.maxLength = '32';

  const ageAnswer = document.querySelector('.quiz__answer-age');
  const ageBtn = document.querySelector('.quiz__btn-age');

  function checkAgeInput() {
    ageBtn.disabled = this.value.length === 0;
  }
  ageAnswer.addEventListener('input', checkAgeInput, false);

  function checkOtherInput(e) {
    console.log(e.currentTarget.value);
  }

  let lettersRegExp = /\p{L}/u;
  $(".quiz__answer-other").on("input", function (e) {
    const el = e.currentTarget;
    const val = el.value;
    if (val.length > 2 && lettersRegExp.test(val)) {
      $(el).parents('.quiz__item').find('.quiz__btn-other')[0].disabled = false;
    } else {
      $(el).parents('.quiz__item').find('.quiz__btn-other')[0].disabled = true;
    }
  });

  checkAgeInput.call(ageAnswer);

  $(`.quiz-item${currentSlide} .quiz__answer`).on('change', function () {
    if ($(`.quiz-item${currentSlide} .quiz__answer`).is(':checked')) $(`.quiz-item${currentSlide} .quiz__btn`).attr('disabled', false);
    else $(`.quiz-item${currentSlide} .quiz__btn`).attr('disabled', true);
  });

  $('.quiz__btn').on('click', function (e) {

    if (currentSlide === 10) {

      $('.quiz__result').html(`
        <p class="quiz__result">
          A ti, como
          <span class="quiz__result-gender">
            ${gender}
          </span>
          de
          <span class="quiz__result-age">
            ${age}
          </span>
          años que buscas mejorar tu salud mental, te recomendamos un programa especial con afirmaciones
          motivacionales y meditaciones relajantes. Está diseñado teniendo en cuenta los resultados que deseas lograr.
        </p>
      `)
    } else if (currentSlide === 5) {
      gender = $("#gender input[type='radio']:checked").val();
    } else if (currentSlide === 6) {
      age = $("#age input").val();
    }

    if (currentSlide === 12) {
      setTimeout(function () {
        $('.quiz-item13').hide();
        currentSlide++;
        LS.setItem('slide', currentSlide);
        $('.quiz-item' + currentSlide).css('display', 'flex');

        let deadline = new Date(Date.parse(new Date()) + 15 * 60 * 1000);
        initializeClock('timer', deadline);
      }, 2850);
    }

    $('.quiz__item').hide();
    currentSlide++;
    LS.setItem('slide', currentSlide);
    $('.quiz-item' + currentSlide).css('display', 'flex');

    $(`.quiz-item${currentSlide} .quiz__answer`).on('change', function () {
      if ($(`.quiz-item${currentSlide} .quiz__answer`).is(':checked')) $(`.quiz-item${currentSlide} .quiz__btn`).attr('disabled', false);
      else $(`.quiz-item${currentSlide} .quiz__btn`).attr('disabled', true);
    });
  });

  const swiper = new Swiper('.reviews__swiper', {
    slidesPerView: 3,
    speed: 850,
    loop: true,

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    pagination: {
      el: '.swiper-pagination',
    },

    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 60,
      },

      550: {
        slidesPerView: 'auto',
        spaceBetween: 60,
      },

      993: {
        slidesPerView: 3,
      }
    }
  });

  const clientsSwiper = new Swiper('.clients__swiper', {
    slidesPerView: 1,
    spaceBetween: 60,
    loop: true,

    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  $('#reload-link').on('click', function () {
    location.reload();
  });

  let quizData = {};
  const quiz = document.querySelector('.quiz__list');

  quiz.addEventListener('input', function (event) {
    quizData[event.target.name] = event.target.value;
    if (event.target.type === 'checkbox' && !event.target.checked) {
      delete quizData[event.target.name];
    }
    LS.setItem('quizData', JSON.stringify(quizData));
  });

  if (LS.getItem('quizData')) {
    quizData = JSON.parse(LS.getItem('quizData'));
    const quizBtn = document.querySelectorAll('.quiz__btn');

    for (let key in quizData) {
      if (quiz.elements[key].type === 'checkbox' && quizData[key] === 'on') {
        quiz.elements[key].checked = true;
        quizBtn.forEach(el => {
          el.disabled = false;
        });
      } else {
        quiz.elements[key].value = quizData[key];
      }
    }
  }

});