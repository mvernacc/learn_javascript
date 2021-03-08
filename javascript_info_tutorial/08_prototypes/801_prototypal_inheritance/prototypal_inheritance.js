"use strict";

// Working with prototype
{
    let animal = {
        jumps: null
    };
    let rabbit = {
        __proto__: animal,
        jumps: true
    };
      
    alert( rabbit.jumps ); // ? (1) - true
    
    delete rabbit.jumps;
    
    alert( rabbit.jumps ); // ? (2) - null
    
    delete animal.jumps;
    
    alert( rabbit.jumps ); // ? (3) - undefined
}


// Searching algorithm
{
    let head = {
        glasses: 1
    };
    
    let table = {
        pen: 3,
        __proto__: head,
    };
    
    let bed = {
        sheet: 1,
        pillow: 2,
        __proto__: table
    };
    
    let pockets = {
        money: 2000,
        __proto__: bed
    };

    console.log(`pockets.pen = ${pockets.pen}`);
    console.log(`bed.glasses = ${bed.glasses}`);

    // No performance difference in modern engines.
}


// Why are both hamsters full?
{
    let hamster = {
        eat(food) {
            this.stomach.push(food);
        }
    };
    
    let speedy = {
        __proto__: hamster,
        stomach: []
    };
    
    let lazy = {
        __proto__: hamster,
        stomach: []
    };
    
    // This one found the food
    speedy.eat("apple");
    console.log(`speedy: ${speedy.stomach}`); // apple
    
    // This one also has it, why? fix please.
    console.log(`lazy: ${lazy.stomach}`); // apple
}
