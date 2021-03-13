"use strict";
let table = document.body.firstElementChild;

for (let tr of table.rows) {
    let td = tr.cells[tr.rowIndex];
    td.style.backgroundColor = "red";
}