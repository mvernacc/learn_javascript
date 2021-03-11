"use strict";

// Pseudo-random generator
function* pseudoRandom(seed) {
    let x = seed;
    while (true) {
        x = x * 16807 % 2147483647;
        yield x;
    }
}

let generator = pseudoRandom(1);

console.log(generator.next().value); // 16807
console.log(generator.next().value); // 282475249
console.log(generator.next().value); // 1622650073
