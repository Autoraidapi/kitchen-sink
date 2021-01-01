(function (factory) {
	var root = (typeof self == "object" && self.self === self && self) || (typeof global == "object" && global.global === global && global);
	if (typeof define === "function" && define.amd) {
		define(function () {
			root.Helper = factory(root);
		});
	} else if (typeof exports !== "undefined") {
		factory(root);
	} else {
		root.Helper = factory(root, {});
	}
})(function (Helper) {

    return Helper;
	
});
