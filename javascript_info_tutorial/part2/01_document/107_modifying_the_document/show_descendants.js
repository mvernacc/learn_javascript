"use strict";


function annotateDescendantCount(list) {
    for (let li of list.getElementsByTagName('li')) {
        let count = li.getElementsByTagName('li').length;
        if (!count) continue;
        li.firstChild.data += `[${count}]`;
    }
}

annotateDescendantCount(
    document.body.querySelector('ul')
);
