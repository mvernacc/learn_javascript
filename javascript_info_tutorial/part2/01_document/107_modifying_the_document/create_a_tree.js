"use strict";

function createTree(container, data) {
    let ul = document.createElement('ul')
    for (let key in data) {
        let obj = data[key];
        
        let li = document.createElement('li');
        li.textContent = key;

        if (!(obj && Object.keys(obj).length === 0 && obj.constructor === Object)) {
            // obj is not empty, create nested list.
            createTree(li, obj)
        }

        ul.append(li);
    }
    container.append(ul);
    return container;
}

let data = {
    "Fish": {
      "trout": {},
      "salmon": {}
    },
  
    "Tree": {
      "Huge": {
        "sequoia": {},
        "oak": {}
      },
      "Flowering": {
        "apple tree": {},
        "magnolia": {}
      }
    }
};

let container = document.getElementById('container');
createTree(container, data);
