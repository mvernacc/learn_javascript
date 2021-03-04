"use strict";

// Filter unique array members
function unique(arr) {
    return Array.from(new Set(arr));
}

let values = ["Hare", "Krishna", "Hare", "Krishna",
    "Krishna", "Krishna", "Hare", "Hare", ":-O"
];

console.log(unique(values)); // Hare, Krishna, :-O


// Filter anagrams
function aclean(arr) {
    let letters_to_word = new Map();
    for (let word of arr) {
        let sorted_letters = word
            .toLowerCase()
            .split('')
            .sort()
            .join('');
        if (!letters_to_word.has(sorted_letters)) {
            letters_to_word.set(sorted_letters, word);
        }
    }
    return Array.from(letters_to_word.values());
}

let arr = ["nap", "teachers", "cheaters", "PAN", "ear", "era", "hectares"];
console.log( aclean(arr) ); // "nap,teachers,ear" or "PAN,cheaters,era"
