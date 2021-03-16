"use strict";

let liNodes = document.querySelectorAll('li');

for (let li of liNodes) {
    let title = li.firstChild.data;
    console.log(title);
    let numNestedLi = li.querySelectorAll('li').length;
    console.log(`Number of nested li nodes: ${numNestedLi}`);
}
