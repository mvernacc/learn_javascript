"use strict";

Function.prototype.defer = function(delay_ms) {
    setTimeout(this, delay_ms);
}

function f() {
    alert("Hello!");
}

f.defer(1000); // shows "Hello!" after 1 second


Function.prototype.defer = function(delay_ms) {
    let f = this;
    return function(...args) {
        setTimeout(() => f.apply(this, args), delay_ms);
    };
}

function g(a, b) {
    alert( a + b );
}

g.defer(1000)(1, 2); // shows 3 after 1 second
