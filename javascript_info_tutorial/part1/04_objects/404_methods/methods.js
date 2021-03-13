"use strict";

// Using "this" in object literal
function makeUser() {
    return {
      name: "John",
      ref: this
    };
}

let user = makeUser();

// alert( user.ref.name ); // What's the result? -> error


// Create a calculator
let calculator = {
    value1: 0,
    value2: 0,
    read() {
        this.value1 = +prompt("Value 1?", "0");
        this.value2 = +prompt("Value 2?", "0");
    },
    sum() {
        return this.value1 + this.value2;
    },
    mul() {
        return this.value1 * this.value2;
    },
};

calculator.read();
alert( calculator.sum() );
alert( calculator.mul() );


// Chaining
let ladder = {
    step: 0,
    up() {
        this.step++;
        return this;
    },
    down() {
        this.step--;
        return this;
    },
    showStep: function() { // shows the current step
        alert( this.step );
        return this;
    }
};

ladder.up().up().down().showStep(); // 1
