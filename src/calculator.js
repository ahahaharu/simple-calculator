export function performCalculation(num1, num2, operator) {
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);

  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '×':
      return num1 * num2;
    case '/':
      return num2 === 0 ? 'Error' : num1 / num2;
    default:
      return num2;
  }
}

export function calculate(displayValue) {
  if (displayValue.includes('Error')) return { result: 'Error', reset: true };

  const tokens = displayValue.match(/(\d+\.?\d*)|[+\-×/]/g);
  if (!tokens || tokens.length < 3) return { result: displayValue, reset: false };

  let result;
  let currentOperator;
  let num1 = parseFloat(tokens[0]);

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];

    if (['+', '-', '×', '/'].includes(token)) {
      currentOperator = token;
    } else {
      const num2 = parseFloat(token);
      if (currentOperator) {
        result = performCalculation(num1, num2, currentOperator);
        if (result === 'Error') {
          return { result: 'Error', reset: true };
        }
        num1 = result;
      }
    }
  }

  return { result: `${num1}`, reset: true };
}

function findLastNumberIndex(displayValue) {
  const operators = ['+', '-', '×', '/'];
  let lastIndex = -1;
  operators.forEach((op) => {
    const index = displayValue.lastIndexOf(op);
    if (index > lastIndex) {
      lastIndex = index;
    }
  });
  return lastIndex;
}

export function toggleSign(displayValue, shouldResetDisplay) {
  if (displayValue.includes('Error') || shouldResetDisplay) {
    return 'Error';
  }

  const lastOpIndex = findLastNumberIndex(displayValue);
  let currentNumber = displayValue.substring(lastOpIndex + 1);
  const baseString = displayValue.substring(0, lastOpIndex + 1);

  if (currentNumber) {
    currentNumber = `(${parseFloat(currentNumber) * -1})`;
    return baseString + currentNumber;
  }
  return displayValue;
}

export function applyPercent(displayValue, shouldResetDisplay) {
  if (displayValue.includes('Error') || shouldResetDisplay) {
    return `${parseFloat(displayValue) / 100}`;
  }

  const lastOpIndex = findLastNumberIndex(displayValue);
  let currentNumber = displayValue.substring(lastOpIndex + 1);
  const baseString = displayValue.substring(0, lastOpIndex + 1);

  if (currentNumber) {
    currentNumber = `${parseFloat(currentNumber) / 100}`;
    return baseString + currentNumber;
  }
  return displayValue;
}
