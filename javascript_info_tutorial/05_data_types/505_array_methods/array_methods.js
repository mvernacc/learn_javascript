"use strict";

// Translate border-left-width to borderLeftWidth
function camelize(str) {
    return str
        .split('-')
        .map(function(item, index, array) {
            if (index == 0) return item;
            return item[0].toUpperCase() + item.slice(1);
        })
        .join('');
}
console.log('camelize:');
console.log(camelize("background-color"));
console.log(camelize("list-style-image"));
console.log(camelize("-webkit-transition"));


// Filter range
function filterRange(arr, a, b) {
    return arr.filter(function(item, index, array) {
        return a <= item && item <= b;
    });
}

let arr = [5, 3, 8, 1];
let filtered = filterRange(arr, 1, 4);

console.log('filterRange:');
console.log(filtered); // 3,1 (matching values)
console.log(arr); // 5,3,8,1 (not modified)


// Filter range "in place"
function filterRangeInPlace(arr, a , b) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (!(a <= arr[i] && arr[i] <= b)) {
            arr.splice(i, 1);
        }
    }
}

arr = [5, 3, 8, 1];
filtered = filterRangeInPlace(arr, 1, 4);

console.log('filterRangeInPlace:');
console.log(arr); // [3, 1]


// Sort in decreasing order
arr = [5, 2, 1, -10, 8];
arr.sort( (a, b) => b - a );
console.log(arr); // 8, 5, 2, 1, -10


// Copy and sort array
function copySorted(arr) {
    return arr
        .map((item) => item) // clone
        .sort();
}

arr = ["HTML", "JavaScript", "CSS"];
console.log('copySorted:');
let sorted = copySorted(arr);
console.log(sorted); // CSS, HTML, JavaScript
console.log(arr); // HTML, JavaScript, CSS (no changes)


// Create an extendable calculator
function Calculator() {
    this.methods = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
    };
    this.addMethod = function(operator, func) {
        this.methods[operator] = func;
    };
    this.calculate = function(expression) {
        let arr = expression.split(' ');
        let a = +arr[0];
        let operator = arr[1];
        let b = +arr[2];

        if (!this.methods[operator] || isNaN(a) || isNaN(b)) {
            return NaN;
        }
        
        return this.methods[operator](a, b);
    };
}
let powerCalc = new Calculator;
powerCalc.addMethod("*", (a, b) => a * b);
powerCalc.addMethod("/", (a, b) => a / b);
powerCalc.addMethod("**", (a, b) => a ** b);

let result = powerCalc.calculate("2 ** 3");
console.log(`Calculator result = ${result}`); // 8
