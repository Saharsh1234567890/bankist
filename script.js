'use strict';

// Accounts
const account1 = {
  owner: 'Saaketh Varanasi',
  movements: [500],
  interestRate: 1, 
  pin: 182013,
};

const account2 = {
  owner: 'Saharsh',
  movements: [500],
  interestRate: 1,
  pin: 232010,
};

const account3 = {
  owner: 'Sridevi Kintali',
  movements: [500],
  interestRate: 1,
  pin: 42007,
};

const account4 = {
  owner: 'Meghashyam Kumar Varanasi',
  movements: [500],
  interestRate: 1,
  pin: 42007,
};

const account5 = {
  owner: 'Upendra Varanasi',
  movements: [500],
  interestRate: 1,
  pin: 123456,
}

const accounts = [account1, account2, account3, account4, account5];

// Varibles
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

let currentAccount;
let sorted = false;

const shortenUserName = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  });
};

shortenUserName(accounts);

const updateUI = acc => {
  displayMovments(acc.movements)
  totalAmmount(acc);
  displaySummary(acc);
}

btnLogin.addEventListener('click', function (e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  
  if (currentAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

  const displayMovments = (movements, sort = false) => {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i){
   const type = mov > 0 ? 'deposit' : 'withdrawal'
   const html = 
   `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}$</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

const totalAmmount = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `$${acc.balance}`;
}

btnTransfer.addEventListener('click', function (e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)

  if (
    amount > 0 && 
    receiverAcc &&
    currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username){
     currentAccount.movements.push(-amount);
     receiverAcc.movements.push(amount);
     updateUI(currentAccount);
  }
  inputTransferTo.blur();
  inputTransferAmount.blur();
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', function (e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
     currentAccount.movements.push(amount);
     updateUI(currentAccount);
  }
  inputLoanAmount.blur();
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e){
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && 
      Number(inputClosePin.value) === currentAccount.pin){
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
        labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.blur();
  inputClosePin.blur();
  inputCloseUsername.value = inputClosePin.value = '';
});

const displaySummary = acc => {
  const incomes = acc.movements
                    .filter(inc => inc > 0)
                    .reduce((acc, inc) => acc + inc, 0);
  labelSumIn.textContent = `$${incomes}`;                 
  const withdrawals = acc.movements
                    .filter(wd => wd < 0)
                    .reduce((acc, wd) => acc + wd, 0);  
  labelSumOut.textContent = `$${Math.abs(withdrawals)}`; 
  const interest = acc.movements
                    .filter(mov => mov > 0)
                    .map(deposit => (deposit * acc.interestRate) / 100)
                    .filter(int => int >= 1)
                    .reduce((acc, int) => acc + int, 0);  
  labelSumInterest.textContent = `$${interest}`;                                 
}

btnSort.addEventListener('click', function (e){
  e.preventDefault();
  displayMovments(currentAccount.movements, !sorted);
  sorted = !sorted;
});
