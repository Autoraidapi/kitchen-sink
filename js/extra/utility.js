(function (factory) {
	var root = (typeof self == "object" && self.self === self && self) || (typeof global == "object" && global.global === global && global);
	if (typeof define === "function" && define.amd) {
		define(function () {
			root.Utility = factory(root);
		});
	} else if (typeof exports !== "undefined") {
		factory(root);
	} else {
		root.Utility = factory(root, {});
	}
})(function (Utility) {


    
    return Utility;
	
});
