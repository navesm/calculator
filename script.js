const calculatorDisplay = document.querySelector('.calculator-display h1');
const inputBtns = document.querySelectorAll('.calculator-buttons button');
const clearBtn = document.getElementById('clear-btn');

// Calculate first and second values depending on operator
const calculate = {
  '/': (firstNumber, secondNumber) => firstNumber / secondNumber,

  '*': (firstNumber, secondNumber) => firstNumber * secondNumber,

  '+': (firstNumber, secondNumber) => firstNumber + secondNumber,

  '-': (firstNumber, secondNumber) => firstNumber - secondNumber,

  '=': (secondNumber) => secondNumber,
  'sin': (firstNumber) => Math.sin(firstNumber),
  'cos': (firstNumber) => Math.cos(firstNumber),
  'tan': (firstNumber) => Math.tan(firstNumber),
  'asin': (firstNumber) => Math.asin(firstNumber),
  'acos': (firstNumber) => Math.acos(firstNumber),
  'atan': (firstNumber) => Math.atan(firstNumber),
  'sqrt': (firstNumber) => Math.sqrt(firstNumber),
  'square': (firstNumber) => firstNumber * firstNumber,
  '^': (firstNumber, secondNumber) => Math.pow(firstNumber, secondNumber),
  'log': (firstNumber) => Math.log10(firstNumber),
  'ln': (firstNumber) => Math.log(firstNumber),
};

let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;

function sendNumberValue(number) {
  //Replace current display value if first value is entered
  if (awaitingNextValue) {
    calculatorDisplay.textContent = number;
    awaitingNextValue = false;
  } else {
    // If current display value is 0, replace it, if not add number
    const displayValue = calculatorDisplay.textContent;
    calculatorDisplay.textContent = displayValue === '0' ? number : displayValue + number;
  }
}

function addDecimal() {
  // If operator pressed, don't add decimal
  if (awaitingNextValue) return;
  // If no decimal, add one
  if (!calculatorDisplay.textContent.includes('.')) {
    calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
  }
}


function useOperator(operator) {
  const currentValue = Number(calculatorDisplay.textContent);
  // Prevent multiple operators
  if (operatorValue && awaitingNextValue) {
    operatorValue = operator;
    return;
  }

  //Handle single-input operators 
  if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'square', 'log', 'ln'].includes(operator)) {
    if (!calculate[operator]) {
      console.error(`Unsupported operator: ${operator}`);
      return;
    }
    const result = calculate[operator](currentValue);
    calculatorDisplay.textContent = result.toFixed(5);
    awaitingNextValue = true;
    return;
  }

  // Assign firstValue if no value
  if (!firstValue) {
    firstValue = currentValue;
  } else {
    const calculation = calculate[operatorValue](firstValue, currentValue);
    firstValue = calculation;
    calculatorDisplay.textContent = firstValue;
  }
  //Ready for next value, store operator
  awaitingNextValue = true;
  operatorValue = operator;

}

// Reset all values, display
function resetAll() {
  firstValue = 0;
  operatorValue = '';
  awaitingNextValue = false;
  calculatorDisplay.textContent = '0';
}

//quadratic solver logic
function solveQuadratic(a, b, c) {
  const discriminant = b * b - 4 * a * c;
  if (discriminant > 0) {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    return `Real Roots: ${root1.toFixed(2)} and ${root2.toFixed(2)}`;
  } else if (discriminant === 0) {
    const root = -b / (2 * a);
    return `One Real Root: ${root.toFixed(2)}`;
  } else {
    const realPart = (-b / (2 * a)).toFixed(2);
    const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
    return `Complex Roots: ${realPart} + ${imaginaryPart}i and ${realPart} - ${imaginaryPart}i`;
  }
}

//Prime factor function
function primeFactorize(n) {
  const factors = [];
  let divisor = 2;

  while (n > 1) {
    while (n % divisor === 0) {
      factors.push(divisor);
      n /= divisor;
    }
    divisor++;

    if (divisor * divisor > n && n > 1) {
      factors.push(n);
      break;
    }
  }

  return factors;
}

// Add Event Listeners for numbers, operators, decimal buttons
inputBtns.forEach((inputBtn) => {
  if (inputBtn.classList.length === 0) {
    inputBtn.addEventListener('click', () => sendNumberValue(inputBtn.value));
  } else if (inputBtn.classList.contains('operator')) {
    inputBtn.addEventListener('click', () => useOperator(inputBtn.value));
  } else if (inputBtn.classList.contains('decimal')) {
    inputBtn.addEventListener('click', () => addDecimal());
  }
});

// Event Listener
clearBtn.addEventListener('click', resetAll);

// Quadratic event listener
document.getElementById('solve-btn').addEventListener('click', () => {
  const a = parseFloat(document.getElementById('a-coeff').value);
  const b = parseFloat(document.getElementById('b-coeff').value);
  const c = parseFloat(document.getElementById('c-coeff').value);
  const output = document.getElementById('quadratic-roots');

  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    output.textContent = "Please enter valid numbers for a,b, and c. "
    return;
  }

  const roots = solveQuadratic(a, b, c);
  output.textContent = roots;
});

// Prime Factorization logic
document.getElementById('factorize-btn').addEventListener('click', () => {
  const input = document.getElementById('prime-input').value;
  const output = document.getElementById('prime-factors');

  if (!input || input <= 1) {
    output.textContent = "Please enter a number greater than 1";
    return;
  }

  const factors = primeFactorize(Number(input));
  output.textContent = factors.join(" * ");
});
