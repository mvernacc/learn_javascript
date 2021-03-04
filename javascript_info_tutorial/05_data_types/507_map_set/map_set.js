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
        let word_lower = word.toLowerCase();
        let letters = Array.from(word_lower)
            .sort((a, b) => a.codePointAt(0) - b.codePointAt(0))
            .join('');
        if (!letters_to_word.has(letters)) {
            letters_to_word.set(letters, word);
        }
    }
    return Array.from(letters_to_word.values());
}

let arr = ["nap", "teachers", "cheaters", "PAN", "ear", "era", "hectares"];
console.log( aclean(arr) ); // "nap,teachers,ear" or "PAN,cheaters,era"
