"use strict";

let timer;


function padZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return '' + num;
}

function update() {
    let now = new Date();

    let hourElem = document.querySelector('.hour');
    hourElem.innerText = padZero(now.getHours());

    let minuteElem = document.querySelector('.minute');
    minuteElem.innerText = padZero(now.getMinutes());

    let secondElem = document.querySelector('.second');
    secondElem.innerText = padZero(now.getSeconds());
}

function clockStart() {
    if (!timer) {
        timer = setInterval(update, 1000);
    }
    update();
}

function clockStop() {
    clearInterval(timer);
    timer = null;
}

update();
