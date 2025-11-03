import '../styles/styles.css';
import { calculate, toggleSign, inputPercent } from './calculator.js';

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

  const lastOperatorIndex = Math.max(
    state.displayValue.lastIndexOf('+'),
    state.displayValue.lastIndexOf('-'),
    state.displayValue.lastIndexOf('×'),
    state.displayValue.lastIndexOf('/'),
  );

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

buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    const value = e.target.innerText;

    switch (value) {
      case 'AC':
        clear();
        break;
      case '+':
      case '-':
      case '×':
      case '/':
        inputOperator(value);
        break;
      case '=':
        const calcResult = calculate(state.displayValue);
        state.displayValue = calcResult.result;
        state.shouldResetDisplay = calcResult.reset;
        if (state.displayValue === 'Error') {
          state.shouldResetDisplay = true;
        }
        break;
      case '.':
        inputDecimal();
        break;
      case '+/-':
        state.displayValue = toggleSign(state.displayValue, state.shouldResetDisplay);
        break;
      case '%':
        state.displayValue = inputPercent(state.displayValue);
        state.shouldResetDisplay = false;
        break;
      default:
        inputNumber(value);
        break;
    }
    updateDisplay();
  });
});

updateDisplay();
