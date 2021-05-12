const calculatorDisplay = document.querySelector(".calculator-display h1");
const inputBtns = document.querySelectorAll(
  ".calculator-buttons button:not(#clear-btn)"
);
const clearBtn = document.getElementById("clear-btn");

let firstValue = 0;
let secondValue = 0;
let operator = "";
let awaitingNextValue = false;
// Calculate first and second vaue depending on operator
const calculate = {
  "/": (firstNumber, secondNumber) => firstNumber / secondNumber,
  "*": (firstNumber, secondNumber) => firstNumber * secondNumber,
  "+": (firstNumber, secondNumber) => firstNumber + secondNumber,
  "-": (firstNumber, secondNumber) => firstNumber - secondNumber,
  "=": (_, secondNumber) => secondNumber,
};

function sendNumberValue(number) {
  // If currentDisplay value is 0, replace it, if not add  number
  const displayValue = calculatorDisplay.textContent;
  if (awaitingNextValue) {
    secondValue += number;
    calculatorDisplay.textContent = `${displayValue}${number}`;
  } else {
    calculatorDisplay.textContent =
      displayValue === "0" ? number : displayValue + number;
  }
}

function useOperator(operation) {
  let currentValue = +calculatorDisplay.textContent;
  //   if there is second value than do operation on it on second turn
  if (operator && secondValue) {
    const calc = calculate[operator](+firstValue, +secondValue);
    firstValue = calc % 1 === 0 ? calc : calc.toFixed(2);
    secondValue = "";
    if (operation !== "=") {
      // if user have type other than (=) than current operator will store and the value + operator will display
      operator = operation;
      calculatorDisplay.textContent = `${firstValue} ${operation} `;
    } else {
      // if user type (=) for calculation than simply show value and restore the first value so that new value can be assign
      calculatorDisplay.textContent = `${firstValue}`;
      operator = "";
      awaitingNextValue = false;
      firstValue = 0;
    }
  } else if (operator && !secondValue && operation !== "=") {
    //   if user has not type second value and double the operator than last operator will rewrite
    operator = operation;
    calculatorDisplay.textContent = `${firstValue} ${operation} `;
  }
  if (!firstValue) {
    firstValue = currentValue;
  }
  if (!operator && operation !== "=") {
    calculatorDisplay.textContent = `${firstValue} ${operation} `;
    operator = operation;
    awaitingNextValue = true;
  }else if(!operator && operation === "="){
    firstValue = 0
  }

  // ready for next value

}

function addDecimal() {
  // if there is operator we can so we have to add (.) to second value
  if (operator) {
    const checkDot = calculatorDisplay.textContent.split(`${operator}`);
    if (!checkDot[1].includes(".")) {
      sendNumberValue(".");
    }
  } else {
    //    if no operator only add (.) to display
    if (!calculatorDisplay.textContent.includes(".")) sendNumberValue(".");
  }
}
// Reset all display
function resetAll() {
  calculatorDisplay.textContent = "0";
  firstValue = 0;
  operator = "";
  secondValue = "";
  awaitingNextValue = false;
}

// Add event listener
inputBtns.forEach((input) => {
  if (!input.classList.length) {
    input.addEventListener("click", sendNumberValue.bind("", input.value));
  } else if (input.classList.contains("operator")) {
    input.addEventListener("click", useOperator.bind("", input.value));
  } else if (input.classList.contains("decimal")) {
    input.addEventListener("click", addDecimal);
  }
});
// Event Listenere
clearBtn.addEventListener("click", resetAll);
