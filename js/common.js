function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
};

function isRegExp(obj) {
    return !!(
        obj &&
        obj.test &&
        obj.exec &&
        (obj.ignoreCase || obj.ignoreCase === false)
    );
};

function isDate(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
};

function isObject(obj) {
    return obj === Object(obj);
};

function isString(obj) {
    return !!(obj === "" || (obj && obj.charCodeAt && obj.substr));
};

function isBoolean(obj) {
    return obj === true || obj === false;
};

function isNumber(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
};

function isNull(obj) {
    return obj === null;
};

function isUndefined(obj) {
    return obj === void 0;
};