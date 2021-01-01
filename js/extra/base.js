(function (factory) {
	var root = (typeof self == "object" && self.self === self && self) || (typeof global == "object" && global.global === global && global);
	if (typeof define === "function" && define.amd) {
		define(function () {
			root.Base = factory(root);
		});
	} else if (typeof exports !== "undefined") {
		factory(root);
	} else {
		root.Base = factory(root, {});
	}
})(function (Base) {
	
	function Ctor(name) {
		this.preinitialize.apply(this, arguments);
		this.name = name;
		this.initialize.apply(this, arguments);
	}

	Ctor.prototype.preinitialize = function () {};

	Ctor.prototype.initialize = function () {};

	Ctor.prototype.prefix = function () {
		return ">";
	};

	Ctor.prototype.toString = function () {
		return "[object ".concat(this.name, "]");
	};

	Ctor.prototype.valueOf = function () {
		return this;
	};

	function createAssigner(keysFunc, undefinedOnly) {
		return function (obj) {
			var length = arguments.length,
				index,
				i;
			if (length < 2 || obj == null) return obj;
			for (index = 1; index < length; index++) {
				var source = arguments[index],
					keys = keysFunc(source),
					l = keys.length;
				for (i = 0; i < l; i++) {
					var key = keys[i];
					if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
				}
			}
			return obj;
		};
	}

	function names(obj) {
		var result = [];
		for (var key in obj) {
			result.push(key);
		}
		return result;
	}

	var extend = createAssigner(names);

	function inherits(protoProps, staticProps) {
		var parent = this,
			child;
		if (
			protoProps &&
			Object.prototype.hasOwnProperty(protoProps, "constructor")
		) {
			child = protoProps.constructor;
		} else {
			child = function () {
				return parent.apply(this, arguments);
			};
		}
		extend(child, parent, staticProps);
		child.prototype = Object.create(parent.prototype, protoProps);
		child.prototype.constructor = child;
		child.__super__ = parent.prototype;
		return child;
	}
	var Model = Base.Model = function(){};

	extend(Model.prototype, {
  
	});
  
	var Collection = Base.Collection = function(){};
  
	extend(Collection.prototype, {
	  model : Model
	});
  
	Model.extend = Collection.extend = inherits;
  
	return Base;
	
});
