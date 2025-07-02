'use strict';

function startGambling() {
  return Math.trunc(Math.random() * 6) + 1;
}

function changeCurrentScore() {
  document.querySelector(`#current--${playersObj.currentPlayer}`).textContent =
    playersObj[`player${playersObj.currentPlayer}`].currentScore;
}

function changeOverallScore() {
  document.querySelector(`#score--${playersObj.currentPlayer}`).textContent =
    playersObj[`player${playersObj.currentPlayer}`].overallScore;
}

function changePlayer() {
  playersObj[`player${playersObj.currentPlayer}`].currentScore = 0;
  changeCurrentScore();
  document
    .querySelector(`.player--${playersObj.currentPlayer}`)
    .classList.remove('player--active');
  playersObj.currentPlayer = (playersObj.currentPlayer + 1) % 2;
  document
    .querySelector(`.player--${playersObj.currentPlayer}`)
    .classList.add('player--active');
}

function changeCurrentNum() {
  if (document.querySelector('.player--winner')) return;
  dice.classList.remove('hidden');
  const randomDiceNum = startGambling();
  dice.src = `dice-${randomDiceNum}.png`;
  playersObj[`player${playersObj.currentPlayer}`].currentScore += randomDiceNum;
  changeCurrentScore();
  if (randomDiceNum === 1) {
    changePlayer();
  }
}

function saveScore() {
  if (document.querySelector('.player--winner')) return;
  playersObj[`player${playersObj.currentPlayer}`].overallScore +=
    playersObj[`player${playersObj.currentPlayer}`].currentScore;
  changeOverallScore();
  if (playersObj[`player${playersObj.currentPlayer}`].overallScore >= 100) {
    document
      .querySelector(`.player--${playersObj.currentPlayer}`)
      .classList.add('player--winner');
    document
      .querySelector(`.player--${playersObj.currentPlayer}`)
      .classList.remove('player--active');
    dice.classList.add('hidden');
  } else {
    changePlayer();
  }
}

function startNewGame() {
  document
    .querySelector(`.player--${playersObj.currentPlayer}`)
    .classList.remove('player--winner');
  for (let i = 0; i < 2; i++) {
    document.querySelector(`#current--${i}`).textContent = 0;
    document.querySelector(`#score--${i}`).textContent = 0;
    playersObj[`player${i}`].currentScore = 0;
    playersObj[`player${i}`].overallScore = 0;
    document.querySelector(`.player--${i}`).classList.remove('player--active');
  }

  dice.classList.add('hidden');
  document.querySelector(`.player--0`).classList.add('player--active');
  playersObj.currentPlayer = 0;
}

const playersObj = {
  currentPlayer: 0,
  player0: {
    currentScore: 0,
    overallScore: 0,
  },
  player1: {
    currentScore: 0,
    overallScore: 0,
  },
};

const holdBtn = document.querySelector('.btn--hold');
const gamblingBtn = document.querySelector('.btn--roll');
const dice = document.querySelector('.dice');
const newGameBtn = document.querySelector('.btn--new');
newGameBtn.addEventListener('click', startNewGame);
gamblingBtn.addEventListener('click', changeCurrentNum);

holdBtn.addEventListener('click', saveScore);
