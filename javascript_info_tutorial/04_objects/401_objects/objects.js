"use strict";

// Hello, object
let user = {};
user.name = "John";
user.surname = "Smith";
user.name = "Pete";
delete user.name;

// Check for emptiness
function isEmpty(obj) {
    for (let _ in obj) {
        return false;
    }
    return true;
}

let schedule = {};

alert( isEmpty(schedule) ); // true

schedule["8:30"] = "get up";

alert( isEmpty(schedule) ); // false


//Sum object properties
let salaries = {
    John: 100,
    Ann: 160,
    Pete: 130
}

function sum(obj) {
    let result = 0;
    for (let key in obj) {
        result += obj[key];
    }
    return result;
}

console.log(`Sum salaries =  ${sum(salaries)}`);  // should be 390
console.log(`Sum empty =  ${sum({})}`);  // should be 0


// Multiply numeric property values by 2
function multiplyNumeric(obj) {
    for (let key in obj) {
        if (typeof(obj[key]) == 'number') obj[key] *= 2;
    }
}

// before the call
let menu = {
    width: 200,
    height: 300,
    title: "My menu"
};
multiplyNumeric(menu);
console.log(menu);
