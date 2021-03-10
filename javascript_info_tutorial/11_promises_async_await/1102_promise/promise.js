"use strict";

// Re-resolve a promise?
{
    let promise = new Promise(function(resolve, reject) {
        resolve(1);
      
        setTimeout(() => resolve(2), 1000);
    });
    
    promise.then(alert); // 1
}


// Delay with a promise
{
    function delay(ms) {
        return new Promise(function(resolve, reject) {
            setTimeout(() => resolve(), ms);
        });
    }
    
    delay(3000).then(() => alert('runs after 3 seconds'));
}

// Animated circle with promise
function go() {
    showCircle(150, 150, 100).then(
        function(div) {
            div.classList.add('message-ball');
            div.append("Hello, world!");
        }
    );
}

function showCircle(cx, cy, radius) {
    let div = document.createElement('div');
    div.style.width = 0;
    div.style.height = 0;
    div.style.left = cx + 'px';
    div.style.top = cy + 'px';
    div.className = 'circle';
    document.body.append(div);

    return new Promise(function(resolve) {
        setTimeout(() => {
            div.style.width = radius * 2 + 'px';
            div.style.height = radius * 2 + 'px';
        
            div.addEventListener('transitionend', function handler() {
                div.removeEventListener('transitionend', handler);
                resolve(div);
            });
        }, 0);
    });
}
