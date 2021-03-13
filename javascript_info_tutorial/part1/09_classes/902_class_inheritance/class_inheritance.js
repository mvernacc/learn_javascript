"use strict";

// Error creating an instance.
{
    class Animal {

        constructor(name) {
            this.name = name;
        }
    
    }

    class Rabbit extends Animal {
        constructor(name) {
            super(name);
            this.created = Date.now();
        }
    }

    let rabbit = new Rabbit("White Rabbit"); // Error: this is not defined
    alert(rabbit.name);
}

// Extended clock

class ExtendedClock extends Clock {
    constructor({ template, precision }) {
        super({ template });
        this.precision = precision; // time between ticks [units: millisecond].
    }

    start() {
        this.render();
        this.timer = setInterval(() => this.render(), this.precision);
    }
}

let ex_clock = new ExtendedClock({ template: "h:m:s", precision: 5000 });
ex_clock.start();
