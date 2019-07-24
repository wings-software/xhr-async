"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function proxymise(target) {
    if (typeof target === 'object') {
        var proxy = function () { return target; };
        proxy.__proxy__ = true;
        return new Proxy(proxy, handler);
    }
    return typeof target === 'function' ? new Proxy(target, handler) : target;
}
exports.default = proxymise;
var handler = {
    construct: function (target, argumentsList) {
        if (target.__proxy__) {
            target = target();
        }
        return proxymise(Reflect.construct(target, argumentsList));
    },
    get: function (target, property, receiver) {
        if (target.__proxy__) {
            target = target();
        }
        if (property !== 'then' && property !== 'catch' && typeof target.then === 'function') {
            return proxymise(target.then(function (value) { return get(value, property, receiver); }));
        }
        return proxymise(get(target, property, receiver));
    },
    apply: function (target, thisArg, argumentsList) {
        if (target.__proxy__) {
            target = target();
        }
        if (typeof target.then === 'function') {
            return proxymise(target.then(function (value) { return Reflect.apply(value, thisArg, argumentsList); }));
        }
        return proxymise(Reflect.apply(target, thisArg, argumentsList));
    }
};
var get = function (target, property, receiver) {
    var value = typeof target === 'object' ? Reflect.get(target, property, receiver) : target[property];
    if (typeof value === 'function' && typeof value.bind === 'function') {
        return Object.assign(value.bind(target), value);
    }
    return value;
};
//# sourceMappingURL=proxymise.js.map