"use strict";

// Output every second
{
    function printNumbersInterval(from, to) {
        let count = from;
        let timerId = setInterval(function() {
                console.log(`${count}`);
                count++;
                if (count > to) {
                    clearInterval(timerId);
                }
            },
            1000
        );
    }
    printNumbersInterval(3, 6);

    function printNumbersTimeout(from, to) {
        let count = from;
        setTimeout(function printAndIncrement() {
                console.log(`${count}`);
                count++;
                if (count <= to) {
                    setTimeout(printAndIncrement, 1000);
                }
            },
            1000
        );
    }
    printNumbersInterval(10, 13);
}