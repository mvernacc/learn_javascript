"use strict";
let visitor_name = prompt("Who's there?");
if (!visitor_name) {
    alert("Canceled");
} else if (visitor_name == "Admin") {
    let password = prompt("Password?");
    if (password === null) {
        alert("Canceled");
    } else if (password == "TheMaster") {
        alert("Welcome!");
    } else {
        alert("Wrong password");
    }
} else {
    alert("I don't know you");
}
