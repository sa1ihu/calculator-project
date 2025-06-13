// Basic math operations
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Error: Can't divide by zero!";
    }
    return a / b;
}

// Main operate function
function operate(operator, a, b) {
    switch(operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            return null;
    }
}

// Round long decimals to prevent display overflow
function roundResult(number) {
    if (typeof number === 'string') return number; // For error messages
    if (number.toString().length > 10) {
        return Math.round(number * 100000) / 100000; // Round to 5 decimal places
    }
    return number;
}

// Calculator state
let displayValue = '0';
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

// Update display
function updateDisplay() {
    const display = document.querySelector('.display-text');
    display.textContent = displayValue;
}

// Handle number input
function inputNumber(number) {
    if (waitingForSecondNumber) {
        displayValue = number;
        waitingForSecondNumber = false;
    } else {
        displayValue = displayValue === '0' ? number : displayValue + number;
    }
    updateDisplay();
}

// Handle clear
function clearCalculator() {
    displayValue = '0';
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    updateDisplay();
}

// Handle operator input
function inputOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);
    
    // If we're waiting for a second number and get another operator,
    // just change the operator (don't calculate)
    if (waitingForSecondNumber) {
        operator = nextOperator;
        return;
    }
    
    if (firstNumber === null) {
        firstNumber = inputValue;
    } else if (operator) {
        const currentValue = firstNumber || 0;
        const newValue = operate(operator, currentValue, inputValue);
        
        displayValue = String(roundResult(newValue));
        firstNumber = newValue;
        updateDisplay();
    }
    
    waitingForSecondNumber = true;
    operator = nextOperator;
}

/*
function inputOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);
    
    if (firstNumber === null) {
        firstNumber = inputValue;
    } else if (operator) {
        const currentValue = firstNumber || 0;
        const newValue = operate(operator, currentValue, inputValue);
        
        displayValue = String(newValue);
        firstNumber = newValue;
        updateDisplay();
    }
    
    waitingForSecondNumber = true;
    operator = nextOperator;
} 
*/

// Handle equals
function calculate() {
    const inputValue = parseFloat(displayValue);
    
     if (firstNumber !== null && operator) {
        const newValue = operate(operator, firstNumber, inputValue);
        const roundedValue = roundResult(newValue);
        displayValue = String(roundedValue);
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = true;
        updateDisplay();
    }
}

// Add event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Number buttons
    const numberButtons = document.querySelectorAll('.number');
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            inputNumber(button.textContent);
        });
    });
    
    // Clear button
    const clearButton = document.querySelector('.clear');
    clearButton.addEventListener('click', clearCalculator);

    // Operator buttons
    const operatorButtons = document.querySelectorAll('.operator');
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            let op = button.textContent;
            // Convert display symbols to operator symbols
            if (op === '×') op = '*';
            if (op === '÷') op = '/';
            inputOperator(op);
        });
    });
    
    // Equals button
    const equalsButton = document.querySelector('.equals');
    equalsButton.addEventListener('click', calculate);

    // Decimal button
    const decimalButton = document.querySelector('.decimal');
    decimalButton.addEventListener('click', inputDecimal);

    // Delete button
    const deleteButton = document.querySelector('.delete');
    deleteButton.addEventListener('click', deleteLastInput);

    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
});

// Handle decimal point input
function inputDecimal() {
    // If waiting for second number, start fresh with "0."
    if (waitingForSecondNumber) {
        displayValue = '0.';
        waitingForSecondNumber = false;
    } else {
        // Only add decimal if there isn't one already
        if (displayValue.indexOf('.') === -1) {
            displayValue += '.';
        }
    }
    updateDisplay();
}

// Handle backspace/delete
function deleteLastInput() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

// Handle keyboard input
function handleKeyboardInput(event) {
    const key = event.key;
    
    // Numbers
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    }
    // Operators
    else if (key === '+') {
        inputOperator('+');
    }
    else if (key === '-') {
        inputOperator('-');
    }
    else if (key === '*') {
        inputOperator('*');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        inputOperator('/');
    }
    // Decimal point
    else if (key === '.') {
        inputDecimal();
    }
    // Equals
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Clear
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearCalculator();
    }
    // Backspace
    else if (key === 'Backspace') {
        deleteLastInput();
    }
}