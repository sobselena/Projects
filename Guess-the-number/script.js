'use strict';

function getRandomNum() {
  return Math.trunc(Math.random() * 20) + 1;
}

function resetGame() {
  scoreObj.score = 20;
  document.querySelector('.score').textContent = scoreObj.score;
  document.body.style.backgroundColor = '#222';
  document.querySelector('.number').textContent = '?';
  secretNum = getRandomNum();
  document.querySelector('.guess').value = '';
  console.log(secretNum);
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.message').textContent = 'Start guessing...';
}

const scoreObj = {
  score: 20,
  highScore: 0,
};

let secretNum = getRandomNum();
console.log(secretNum);

function checkNum() {
  const guess = Number(document.querySelector('.guess').value);
  if (!guess) {
    document.querySelector('.message').textContent = 'Not a Number!';
  } else if (guess === secretNum) {
    document.querySelector('.message').textContent = 'Correct Number!';
    document.querySelector('.number').style.width = '30rem';
    document.querySelector('.number').textContent = secretNum;
    if (
      document.body.style.backgroundColor !== 'green' &&
      scoreObj.score > scoreObj.highScore
    ) {
      scoreObj.highScore = scoreObj.score;
      document.querySelector('.highscore').textContent = scoreObj.highScore;
    }
    document.body.style.backgroundColor = 'green';
  } else if (guess !== secretNum) {
    if (scoreObj.score > 1) {
      document.querySelector('.message').textContent =
        guess > secretNum ? 'Too high!' : 'Too low!';
      scoreObj.score -= 1;
      document.querySelector('.score').textContent = scoreObj.score;
    } else {
      document.querySelector('.message').textContent = 'You lost the game';
      document.querySelector('.score').textContent = '0';
    }
  }
}

document.querySelector('.check').addEventListener('click', checkNum);
document.querySelector('.again').addEventListener('click', resetGame);
