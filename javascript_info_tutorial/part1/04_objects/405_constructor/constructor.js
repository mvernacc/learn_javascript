"use strict";

// Two functions – one object
let common_object = {};
function A() {
    return common_object;
}
function B() {
    return common_object;
}

let a = new A();
let b = new B();

alert(a == b);


// Create new Calculator
function Calculator() {
    this.value1 = 0;
    this.value2 = 0;
    this.read = function() {
        this.value1 = +prompt("Enter value 1", "0");
        this.value2 = +prompt("Enter value 2", "0");
    }
    this.sum = function() {
        return this.value1 + this.value2;
    };
    this.mul = function() {
        return this.value1 * this.value2;
    };
}
let calculator = new Calculator();
calculator.read();

alert( "Sum=" + calculator.sum() );
alert( "Mul=" + calculator.mul() );


// Create new Accumulator
function Accumulator(startingValue) {
    this.value = +startingValue;
    this.read = function() {
        this.value += +prompt("New number", "0");
    }
}

let accumulator = new Accumulator(1); // initial value 1

accumulator.read(); // adds the user-entered value
accumulator.read(); // adds the user-entered value

alert(accumulator.value); // shows the sum of these values
