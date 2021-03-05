"use strict";

// Does a function pickup latest changes?
{
    let name = "John";

    function sayHi() {
        alert("Hi, " + name);
    }

    name = "Pete";

    sayHi(); // what will it show: "John" or "Pete"? - shows Pete
}

// Which variables are available?
{
    function makeWorker() {
        let name = "Pete";
      
        return function() {
          alert(name);
        };
    }
      
    let name = "John";
    
    // create a function
    let work = makeWorker();
    
    // call it
    work(); // what will it show? - Pete
}

// Function in if
/* This example results in an error.
{
    let phrase = "Hello";

    if (true) {
        let user = "John";

        function sayHi() {
            alert(`${phrase}, ${user}`);
        }
    }

    sayHi();
}
*/


// Sum with closures
{
    function sum(a) {
        return function(b) {
            return a + b;
        };
    }

    console.log(`sum: ${sum(1)(2)}`);
}

/* This example results in an error.
{
    let x = 1;

    function func() {
        console.log(x); // Cannot access 'x' before initialization

        let x = 2;
    }

    func();
}
*/


// Filter through function
{
    function inBetween(low, high) {
        return function(item) {
            return low <= item && item <= high;
        };
    }
    function inArray(array) {
        return function(item) {
            return array.includes(item);
        };
    }

    let arr = [1, 2, 3, 4, 5, 6, 7];
    console.log( arr.filter(inBetween(3, 6)) ); // 3,4,5,6
    console.log( arr.filter(inArray([1, 2, 10])) ); // 1,2
}

// Sort by field
{
    function byField(field) {
        return function(a, b) {
            return a[field] > b[field] ? 1 : -1;
        }
    }

    let users = [
        { name: "John", age: 20, surname: "Johnson" },
        { name: "Pete", age: 18, surname: "Peterson" },
        { name: "Ann", age: 19, surname: "Hathaway" }
    ];
    console.log(JSON.stringify(
        users.sort(byField('name')), null, 2));
    console.log(JSON.stringify(
        users.sort(byField('age')), null, 2));
}

// Army of functions
{
    function makeArmy() {
        let shooters = [];
      
        let i = 0;
        // Could also use a for loop, whcih provides a new Lexical Environment for each iteration, unlike while
        while (i < 10) {
            let my_number = i; // Create a new number in the iteration's Lexical Environment
            let shooter = function() { // create a shooter function,
                console.log(`shooter ${my_number}`); // that should show its number
            };
            shooters.push(shooter); // and add it to the array
            i++;
        }
      
        // ...and return the array of shooters
        return shooters;
    }
    
    let army = makeArmy();
    
    // all shooters show 10 instead of their numbers 0, 1, 2, 3...
    army[0](); // 10 from the shooter number 0
    army[1](); // 10 from the shooter number 1
    army[2](); // 10 ...and so on.
}
