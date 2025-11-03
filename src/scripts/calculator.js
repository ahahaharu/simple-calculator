function findLastOperatorIndex(displayValue) {
  const operators = ['+', '-', '×', '/'];
  let lastIndex = -1;
  operators.forEach((op) => {
    const index = displayValue.lastIndexOf(op);
    if (index > lastIndex) {
      lastIndex = index;
    }
  });

  if (displayValue[lastIndex - 1] === '(') {
    return lastIndex - 2;
  } else return lastIndex;
}

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

  let formula = displayValue.split(' ').join('');

  while (formula.includes('(') || formula.includes(')')) {
    formula = formula.replace('(-', '-');
    formula = formula.replace(')', '');
  }

  const operators = ['+', '-', '×', '/'];
  let tokens = [];
  let currentToken = '';

  for (let i = 0; i < formula.length; i++) {
    const char = formula[i];

    if (operators.includes(char)) {
      if (char === '-' && (i === 0 || operators.includes(formula[i - 1]))) {
        currentToken += char;
      } else {
        if (currentToken) {
          tokens.push(currentToken);
        }
        tokens.push(char);
        currentToken = '';
      }
    } else {
      currentToken += char;
    }
  }
  if (currentToken) {
    tokens.push(currentToken);
  }

  if (tokens.length < 1) return { result: displayValue, reset: false };
  if (tokens.length === 1 && tokens[0].endsWith('%')) {
    const num = parseFloat(tokens[0].slice(0, -1)) / 100;
    return { result: `${num}`, reset: true };
  }
  if (tokens.length === 2 && operators.includes(tokens[tokens.length - 1])) {
    return { result: displayValue, reset: false };
  }

  const highPrecedenceOperators = ['×', '/'];
  let intermediateTokens = [];

  let tempNum = parseFloat(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    let currentOperator = tokens[i];
    let num2Token = tokens[i + 1];

    if (!num2Token) break;

    let num2;
    let isPercent = num2Token.endsWith('%');
    num2 = parseFloat(isPercent ? num2Token.slice(0, -1) : num2Token);

    if (isPercent) {
      if (highPrecedenceOperators.includes(currentOperator)) {
        num2 = num2 / 100;
      } else {
        num2 = tempNum * (num2 / 100);
      }
    }

    if (highPrecedenceOperators.includes(currentOperator)) {
      tempNum = performCalculation(tempNum, num2, currentOperator);
      if (tempNum === 'Error') return { result: 'Error', reset: true };
    } else {
      intermediateTokens.push(tempNum, currentOperator);
      tempNum = num2;
    }
  }
  intermediateTokens.push(tempNum);

  let finalResult = intermediateTokens.length > 0 ? parseFloat(intermediateTokens[0]) : 0;

  for (let i = 1; i < intermediateTokens.length; i += 2) {
    let currentOperator = intermediateTokens[i];
    let num2 = parseFloat(intermediateTokens[i + 1]);

    finalResult = performCalculation(finalResult, num2, currentOperator);
    if (finalResult === 'Error') return { result: 'Error', reset: true };
  }

  return { result: `${finalResult}`, reset: true };
}

export function toggleSign(displayValue, shouldResetDisplay) {
  if (displayValue.includes('Error')) {
    return 'Error';
  }

  if (shouldResetDisplay) {
    const currentValue = parseFloat(displayValue);
    return `${currentValue * -1}`;
  }

  const lastOpIndex = findLastOperatorIndex(displayValue);
  let currentNumber = displayValue.substring(lastOpIndex + 1);
  const baseString = displayValue.substring(0, lastOpIndex + 1);

  if (!currentNumber) {
    return displayValue;
  }

  const num = currentNumber;

  if (num.startsWith('(') && num.endsWith(')')) {
    let innerValue = num.substring(1, num.length - 1);

    if (innerValue.startsWith('-')) {
      return baseString + innerValue.substring(1);
    } else {
      return baseString + `(-${innerValue})`;
    }
  } else if (num.startsWith('-')) {
    const positiveValue = num.substring(1);
    return baseString + positiveValue;
  } else {
    return baseString + `(-${num})`;
  }
}

export function inputPercent(displayValue) {
  if (displayValue.includes('Error')) return displayValue;

  const lastChar = displayValue.slice(-1);
  if (['+', '-', '×', '/', '%', '.'].includes(lastChar)) {
    return displayValue;
  }

  if (displayValue === '0') {
    return displayValue;
  }

  if (lastChar === ')') {
    const lastOpenBracket = displayValue.lastIndexOf('(');
    if (lastOpenBracket !== -1) {
      return displayValue.slice(0, -1) + '%' + lastChar;
    }
  }

  return displayValue + '%';
}
