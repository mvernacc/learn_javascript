"use strict";

let DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

function createCalendar(elem, year, month) {
    let table = document.createElement('table');

    // Make the day-of-the-week header
    let header = document.createElement('thead');
    let headRow = document.createElement('tr');
    for (let day of DAYS) {
        let th = document.createElement('th');
        th.innerText = day;
        headRow.append(th);
    }
    header.append(headRow);
    table.append(header);

    let startOfMonth = new Date(year, month - 1);
    let endOfMonth = new Date(year, month, 0);
    let numberOfDaysInMonth = endOfMonth.getDate();
    let startDayOfWeek = startOfMonth.getDay();
    let startColumn = startDayOfWeek - 1;
    if (startColumn == -1) startColumn = 6;

    // Make blank cells before the first day of the month.
    let col = 0;
    let row = document.createElement('tr');
    while (col < startColumn) {
        row.append(document.createElement('td'));
        col++;
    }

    // Fill in the cells for each day of the month.
    let dayCounter = 1;
    while (dayCounter <= numberOfDaysInMonth) {
        let dayCell = document.createElement('td');
        dayCell.innerText = dayCounter;
        row.append(dayCell);

        dayCounter++;
        col++;
        if (col > 6) {
            // New week, new row
            table.append(row);
            row = document.createElement('tr');
            col = 0;
        }
    }
    if (col) table.append(row);

    elem.append(table);
}

createCalendar(cal, 2012, 9);
