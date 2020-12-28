var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var routeStripper = /^[#\/]|\s+$/g;
var rootStripper = /^\/+|\/+$/g;
var pathStripper = /#.*$/;
var noMatch = /(.)^/;

var escapeMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#x27;",
	"`": "&#x60;"
};

var escapes = {
	"'": "'",
	"\\": "\\",
	"\r": "r",
	"\n": "n",
	"\u2028": "u2028",
	"\u2029": "u2029"
};

var escapeChar = function (match) {
	return "\\" + escapes[match];
};

var settings = {
	evaluate: /<%([\s\S]+?)%>/g,
	interpolate: /<%=([\s\S]+?)%>/g,
	escape: /<%-([\s\S]+?)%>/g
};

function micro(object) {
	if (object instanceof micro) return object;
	if (!(this instanceof micro)) return new micro(object);
	this._object = object;
};

micro.prototype.toJSON = function(){
	return JSON.stringify(this._object,null,2);
};

function Macro(){
	this.preinitialize.apply(this, arguments);
	this.initialize.apply(this, arguments);
};

Macro.prototype = Object.create(micro.prototype, {
	constructor : {
		enumerable : true,
		value : Macro,
		writeable : true,
		configurable : true,
	}
});

Macro.prototype = {
	preinitialize : function(){},
	initialize : function(){}
};

var maximin = new Macro();

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