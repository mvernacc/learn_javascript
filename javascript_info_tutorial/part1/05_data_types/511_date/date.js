"use strict";
const feb20 = new Date(2012, 1, 20, 3, 12);
alert(feb20);


// Show a weekday
const weekday_abbreviations = ["SU", "MO", "TU", "WE", "TR", "FR", "SA"];
function getWeekDay(date) {
    return weekday_abbreviations[date.getDay()]
}
let date = new Date(2012, 0, 3);
console.log(`get weekday = ${getWeekDay(date)}`); // should output "TU"


// European weekday
function getEuroDay(date) {
    return ((date.getDay() - 1) % 7 + 7) % 7 + 1;
}
console.log(`Euro day number = ${getEuroDay(date)}`);

// Which day of month was many days ago?
function getDateAgo(date, days) {
    let date2 = new Date(date.getTime());
    date2.setDate(date2.getDate() - days);
    return date2.getDate();
}

date = new Date(2015, 0, 2);

console.log(`date ago: ${getDateAgo(date, 1)}`); // 1, (1 Jan 2015)
console.log(`date ago: ${getDateAgo(date, 2)}`); // 31, (31 Dec 2014)
console.log(`date ago: ${getDateAgo(date, 365)}`); // 2, (2 Jan 2014)

// How many seconds till tomorrow?
function getSecondsToTomorrow() {
    const now = new Date();
    const tomorrow = new Date(
        now.getFullYear(), now.getMonth(), now.getDate() + 1);
    let milliseconds_to_tomorrow = tomorrow.getTime() - now.getTime();
    return milliseconds_to_tomorrow / 1000;
}
console.log(`second to tomorrow = ${getSecondsToTomorrow()}`);
