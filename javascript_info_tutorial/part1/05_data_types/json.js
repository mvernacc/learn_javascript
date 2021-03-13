"use strict";

// Turn the object into JSON and back
let user = {
    name: "John Smith",
    age: 35
};
const user_json = JSON.stringify(user);
console.log(user_json);
let user2 = JSON.parse(user_json);


// Exclude backreferences

let room = {
    number: 23
};

let meetup = {
    title: "Conference",
    occupiedBy: [{name: "John"}, {name: "Alice"}],
    place: room
};

// circular references
room.occupiedBy = meetup;
meetup.self = meetup;

console.log(JSON.stringify(meetup, function replacer(key, value) {
    return (key != "" && value == meetup)  ? undefined : value;
}, 2));
