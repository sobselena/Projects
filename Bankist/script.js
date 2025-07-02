'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(movement, '+');
//   } else if (movement < 0) {
//     console.log(movement, '-');
//   }
// }

// movements.forEach(movement => {
//   if (movement > 0) {
//     console.log(movement, '+');
//   } else if (movement < 0) {
//     console.log(movement, '-');
//   }
// });

const displayMovements = function (movements, sort = false) {
  const movs = sort ? [...movements].sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = '';
  movs.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}
      </div>

      <div class="movements__date"></div>
      <div class="movements__value">${movement} €</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const updateData = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc.movements, acc.interestRate);
};

displayMovements(account1.movements);

const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsernames(accounts);

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);

  labelBalance.textContent = `${account.balance}€`;
};

accounts.forEach(account => {
  console.log(account);
  console.log(calcDisplayBalance(account));
});

// const calcAverage = function (dogAges) {
//   const newArr = dogAges
//     .map(dogAge => {
//       if (dogAge <= 2) return 2 * dogAge;
//       else return 16 + 4 * dogAge;
//     })
//     .filter(age => age >= 18);
//   return newArr.reduce((acc, age) => acc + age) / newArr.length;
// };

// console.log(calcAverage([5, 2, 4, 1, 15, 8, 3]));

const calcDisplaySummary = function (movements, interestRate) {
  const incomes = movements
    .filter(movement => movement > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const out = movements
    .filter(movement => movement < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

calcDisplaySummary(account1.movements);

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(account => {
    return account.username === inputLoginUsername.value;
  });
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    updateData(currentAccount);

    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferTo = accounts.find(account => {
    return account.username === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);
  if (
    transferTo &&
    inputTransferAmount.value > 0 &&
    transferTo?.username !== currentAccount.username &&
    currentAccount.balance - amount >= 0
  ) {
    transferTo.movements.push(amount);
    currentAccount.movements.push(-amount);

    displayMovements(currentAccount.movements);
    updateData(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(acc => {
      return currentAccount.username === acc.username;
    });
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(mov => {
      return mov >= 0.1 * amount;
    })
  ) {
    currentAccount.movements.push(amount);
    updateData(currentAccount);
  }

  inputLoanAmount.value = '';
});
let toggleSortBtn = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, toggleSortBtn);
  toggleSortBtn = false;
});

console.log(movements);

const groupedMovements = Object.groupBy(movements, movement =>
  movement > 0 ? 'deposits' : 'withdrawals'
);

console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return 'very active';
  if (movementCount >= 4) return 'active';
  if (movementCount >= 1) return 'moderate';
  return 'inactive';
});
console.log(groupedByActivity);

console.log(groupedByActivity);

const arr = new Array(7);

arr.fill(1);
console.log(arr);

const newArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
newArr.fill(23, 1, 5);
console.log(newArr);

const y = Array.from({ length: 5 }, (_, i) => i + 1);

console.log(y);

const randomDices = Array.from(
  { length: 100 },
  () => Math.trunc(Math.random() * 6) + 1
);

console.log(randomDices);

labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);
});

console.log(
  accounts
    .flatMap(account => account.movements)
    .filter(mov => mov > 0)
    .reduce((acc, value) => acc + value, 0)
);

console.log(
  accounts
    .flatMap(account => account.movements)
    .reduce((acc, value) => {
      if (value >= 1000) {
        acc++;
        return acc;
      }
      return acc;
    }, 0)
);

const sum = accounts
  .flatMap(account => account.movements)
  .reduce(
    (acc, value) => {
      if (value > 0) {
        acc.deposit += value;
      } else {
        acc.withdrawal += Math.abs(value);
      }

      return acc;
    },
    {
      deposit: 0,
      withdrawal: 0,
    }
  );

console.log(sum);
