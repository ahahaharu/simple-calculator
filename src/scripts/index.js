import '../styles/styles.css';
import { calculate, toggleSign, inputPercent, findLastOperatorIndex } from './calculator.js';

const state = {
  displayValue: '0',
  shouldResetDisplay: false,
};

const display = document.querySelector('.calculator__display');
const buttons = Array.from(document.querySelectorAll('.button'));

function updateDisplay() {
  display.innerText = state.displayValue;
  const displayLength = display.innerText.length;

  if (displayLength > 10) {
    display.style.fontSize = '2em';
  } else if (displayLength > 8) {
    display.style.fontSize = '2.5em';
  } else if (displayLength > 6) {
    display.style.fontSize = '3em';
  } else {
    display.style.fontSize = '4em';
  }
}

function clear() {
  state.displayValue = '0';
  state.shouldResetDisplay = false;
}

function inputNumber(number) {
  if (state.displayValue === '0' || state.shouldResetDisplay) {
    state.displayValue = number;
    state.shouldResetDisplay = false;
  } else if (state.displayValue.slice(-1) === ')') {
    state.displayValue += '×' + number;
  } else {
    state.displayValue += number;
  }
}

function inputDecimal() {
  if (state.shouldResetDisplay) {
    state.displayValue = '0.';
    state.shouldResetDisplay = false;
    return;
  }

  const lastOperatorIndex = findLastOperatorIndex(state.displayValue);

  const currentNumber =
    lastOperatorIndex === -1
      ? state.displayValue
      : state.displayValue.substring(lastOperatorIndex + 1);

  if (!currentNumber.includes('.')) {
    state.displayValue += '.';
  }
}

function inputOperator(operator) {
  if (state.displayValue.includes('Error')) return;

  if (state.shouldResetDisplay) {
    state.shouldResetDisplay = false;
  }

  if (operator === '-' && state.displayValue === '0') {
    state.displayValue = '-';
    return;
  }

  const lastChar = state.displayValue.slice(-1);
  if (['+', '-', '×', '/'].includes(lastChar)) {
    state.displayValue = state.displayValue.slice(0, -1) + operator;
  } else {
    state.displayValue += operator;
  }
}

function handleInput(value) {
  switch (value) {
    case 'AC':
    case 'c':
    case 'C':
    case 'Escape':
      clear();
      break;

    case '+':
    case '-':
      inputOperator(value);
      break;
    case '*':
      inputOperator('×');
      break;
    case '/':
      inputOperator('/');
      break;

    case '=':
    case 'Enter':
      const calcResult = calculate(state.displayValue);
      state.displayValue = calcResult.result;
      state.shouldResetDisplay = calcResult.reset;
      if (state.displayValue === 'Error') {
        state.shouldResetDisplay = true;
      }
      break;

    case '.':
    case ',':
      inputDecimal();
      break;

    case '%':
      state.displayValue = inputPercent(state.displayValue);
      state.shouldResetDisplay = false;
      break;

    case '+/-':
      state.displayValue = toggleSign(state.displayValue, state.shouldResetDisplay);
      break;

    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      inputNumber(value);
      break;

    case 'Backspace':
      if (state.displayValue.includes('Error') || state.shouldResetDisplay) {
        clear();
      } else if (state.displayValue.length > 1) {
        state.displayValue = state.displayValue.slice(0, -1);
      } else {
        clear();
      }
      break;

    default:
      return;
  }
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    handleInput(e.target.innerText);
  });
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key === 'Enter') {
    e.preventDefault();
    handleInput('Enter');
  } else if (key === '*') {
    e.preventDefault();
    handleInput('*');
  } else {
    handleInput(key);
  }
});

const themeToggleButton = document.getElementById('theme-toggle');

function toggleTheme() {
  const body = document.body;
  const isLightTheme = body.classList.toggle('light-theme');

  themeToggleButton.innerText = isLightTheme ? '☀️' : '🌙';

  localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;

  if (savedTheme === 'light') {
    body.classList.add('light-theme');
    themeToggleButton.innerText = '☀️';
  } else {
    body.classList.remove('light-theme');
    themeToggleButton.innerText = '🌙';
  }
}

initializeTheme();

themeToggleButton.addEventListener('click', toggleTheme);

updateDisplay();
