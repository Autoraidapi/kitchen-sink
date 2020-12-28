/* DOM Abstraction */

window.qs = function (selector, scope) {
	return (scope || document).querySelector(selector);
};

window.qsa = function (selector, scope) {
	return (scope || document).querySelectorAll(selector);
};

window.$on = function (target, type, callback, useCapture) {
	target.addEventListener(type, callback, !!useCapture);
};

window.$delegate = function (target, selector, type, handler) {
	function dispatchEvent(event) {
		var targetElement = event.target;
		var potentialElements = window.qsa(selector, target);
		var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

		if (hasMatch) {
			handler.call(targetElement, event);
		}
	}
	var useCapture = type === 'blur' || type === 'focus';
	window.$on(target, type, dispatchEvent, useCapture);
};

window.$parent = function (element, tagName) {
	if (!element.parentNode) {
		return;
	}
	if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
		return element.parentNode;
	}
	return window.$parent(element.parentNode, tagName);
};

DocumentFragment.prototype.append = function (target) {
	return this.appendChild(target);
};
DocumentFragment.prototype.render = function (target) {
	return target.appendChild(this);
};

function View() {

	/*  */
	this.preinitialize.apply(this, arguments);

	/* cache DOM node */
	this.category = document.querySelector("#category");
	this.searchTerm = document.querySelector("#searchTerm");
	this.searchBtn = document.querySelector("button");
	this.article = document.querySelector("article");

	this.initialize.apply(this, arguments);

}

View.prototype = {

	preinitialize: function () {

	},

	initialize: function () {

	},

	fetch: function (type, url) {
		this.request = new XMLHttpRequest();
		this.request.open('GET', url, true);
		this.request.responseType = type;
		this.request.addEventListener('load');
		this.request.send(null);
	},

	updateDisplay: function () {},
	selectProduct: function () {},
	showProduct: function () {}

};