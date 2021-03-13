"use strict";

// Array operations.
let styles = ["Jazz", "Blues"];
styles.push("Rock-n-Roll");
styles[Math.floor(styles.length / 2)] = "Classics";
console.log(styles);
console.log(styles.shift());
styles.unshift("Rap", "Reggae");
console.log(styles);


// Calling in an array context
let arr = ["a", "b"];

arr.push(function() {
  alert( this );
})

arr[2](); // a,b,function


// A maximal subarray
function getMaxSubSum(arr) {
    let best_sum = 0;
    let current_sum = 0;
    for (let x of arr) {
        current_sum = Math.max(0, current_sum + x);
        best_sum = Math.max(current_sum, best_sum);
    }
    return best_sum;
}
console.log(getMaxSubSum([-1, 2, 3, -9]) == 5);
console.log(getMaxSubSum([2, -1, 2, 3, -9]) == 6);
console.log(getMaxSubSum([-1, 2, 3, -9, 11]) == 11);
console.log(getMaxSubSum([100, -9, 2, -3, 5]) == 100);
console.log(getMaxSubSum([1, 2, 3]) == 6);
