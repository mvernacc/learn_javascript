let table = document.getElementById('bagua-table');

for (let td of table.querySelectorAll('td')) {
    td.tabIndex = 0;
}

let editor = document.createElement('textarea');
editor.className = 'editor';

let okButton = document.createElement('button');
okButton.className = 'ok-button';
okButton.innerHTML = 'Ok';
okButton.onclick = saveEdit;

let cancelButton = document.createElement('button');
cancelButton.className = 'cancel-button';
cancelButton.innerHTML = 'Cancel';
cancelButton.onclick = cancelEdit;

let buttonDiv= document.createElement('div');
buttonDiv.className = 'button-container';
buttonDiv.append(okButton, cancelButton);

let replacedElem = null;

function startEdit(elem) {
    editor.value = elem.innerHTML;
    editor.style.width = elem.clientWidth + 'px';
    editor.style.height = elem.offsetHeight + 'px';
    elem.replaceWith(editor);
    replacedElem = elem;

    table.append(buttonDiv);
    buttonDiv.style.top = editor.getBoundingClientRect().bottom + 'px';
    buttonDiv.style.left = editor.getBoundingClientRect().left + 'px';
}

function saveEdit() {
    replacedElem.innerHTML = editor.value;
    editor.replaceWith(replacedElem);
    replacedElem = null;

    buttonDiv.remove();
}

function cancelEdit() {
    editor.replaceWith(replacedElem);
    replacedElem = null;

    buttonDiv.remove();
}

table.addEventListener('focusin', function (event) {
    if (event.target.tagName != 'TD') return;
    if (!replacedElem) {
        startEdit(event.target);
    } else {
        // Edit in progress, block change of focus to other td.
        event.preventDefault();
    }
});


