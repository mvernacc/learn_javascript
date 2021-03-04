"use strict";

let user = { name: "John", years: 30 };

// your code to the left side:
let {name, years: age, isAdmin = false} = user;

console.log( name ); // John
console.log( age ); // 30
console.log( isAdmin ); // false


// The maximal salary
function topSalary(salaries) {
    let top_name = null;
    let top_salary = 0;
    for (const [name, salary] of Object.entries(salaries)) {
        if (salary > top_salary) {
            top_salary = salary;
            top_name = name;
        }
    }
    return top_name;
}

let salaries = {
    "John": 100,
    "Pete": 300,
    "Mary": 250
};
console.log(`Top salary: ${topSalary(salaries)}`);
