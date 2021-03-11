"use strict";


// Error on reading non-existent property
{
    let user = {
        name: "John"
    };
      
    function wrap(target) {
        return new Proxy(target, {
            get(target, prop, receiver) {
                if (prop in target) {
                    return Reflect.get(target, prop, receiver);
                } else {
                    throw new ReferenceError(`Property doesn't exist ${prop}`);
                }
            }
        });
    }
      
    user = wrap(user);
      
    console.log(user.name); // John
    // console.log(user.age); // ReferenceError: Property doesn't exist: "age"
}


// Accessing array[-1]
{
    let array = [1, 2, 3];

    array = new Proxy(array, {
        get(target, prop, receiver) {
            let index = Number(prop);
            if (index < 0) {
                index += target.length;
            }
            return Reflect.get(target, index, receiver);
        }
    });

    console.log(array[0]);  // 1
    console.log(array[-1]); // 3
    console.log(array[-2]); // 2
}


// Observable
{
    let observers = Symbol('observers');
    function makeObservable(target) {
        target[observers] = [];
        target.observe = function(observer) {
            this[observers].push(observer);
        };

        return new Proxy(target, {
            set(target, property, value, receiver) {
                let success = Reflect.set(...arguments);
                if (success) {
                    target[observers].forEach(observer => observer(property, value));
                }
                return success;
            }
        })
    }
      
    let user = {};
    user = makeObservable(user);
    
    user.observe((key, value) => {
        console.log(`SET ${key}=${value}`);
    });
    
    user.name = "John"; // alerts: SET name=John
}