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


// Map to names
let john = { name: "John", age: 25 };
let pete = { name: "Pete", age: 30 };
let mary = { name: "Mary", age: 28 };

let users = [ john, pete, mary ];

let names = users.map((user) => user.name);

console.log(`Map to names: ${names}`); // John, Pete, Mary


// Sort users by age
function sortByAge(arr) {
    return arr.sort((user_a, user_b)  => user_a.age - user_b.age);
}
sortByAge(users);
console.log(`Sort by age: ${users.map(user => user.name)}`); // John, Mary, Pete


// Shuffle an array
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

arr = [1, 2, 3];
shuffle(arr);
console.log(`Shuffle: ${arr}`);
shuffle(arr);
console.log(`Shuffle: ${arr}`);


// Get average age
function getAverageAge(arr) {
    return arr.reduce(
        (accumulator, item) => accumulator + item.age,
        0
    ) / arr.length;
}
console.log(`Average age: ${getAverageAge(users)}`); // 27.6666...


// Filter unique array members
function unique(arr) {
    return arr.reduce(
        (accumulator, item) => {
            if (!accumulator.includes(item)) accumulator.push(item);
            return accumulator;
        },
        []
    );
}
  
let strings = ["Hare", "Krishna", "Hare", "Krishna",
    "Krishna", "Krishna", "Hare", "Hare", ":-O"
];
  
console.log(`unique: ${unique(strings)}` ); // Hare, Krishna, :-O


// Create keyed object from array
function groupById(users) {
    return users.reduce(
        (accumulator, item) => {
            accumulator[item.id] = item;
            return accumulator
        },
        {}
    );
}

users = [
    {id: 'john', name: "John Smith", age: 20},
    {id: 'ann', name: "Ann Smith", age: 24},
    {id: 'pete', name: "Pete Peterson", age: 31},
];

let usersById = groupById(users);
console.log(`Group by ID: ${usersById}`);

/*
// after the call we should have:

usersById = {
john: {id: 'john', name: "John Smith", age: 20},
ann: {id: 'ann', name: "Ann Smith", age: 24},
pete: {id: 'pete', name: "Pete Peterson", age: 31},
}
*/