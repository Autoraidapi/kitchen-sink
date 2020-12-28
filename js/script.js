(function (global) {

    function createAssigner(keysFunc, undefinedOnly) {
        return function (obj) {
            var length = arguments.length,
                index, i;
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
    };

    function names(obj) {
        var result = [];
        for (var key in obj) {
            result.push(key);
        }
        return result;
    };

    global.extend = createAssigner(names);

    function inherits(protoProps, staticProps) {
        var parent = this,
            child;
        if (protoProps && Object.prototype.hasOwnProperty(protoProps, "constructor")) {
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
    };

    var Emitter = global.Emitter = {
        on: function (event, listener) {
            this._eventCollection = this._eventCollection || {};
            this._eventCollection[event] = this._eventCollection[event] || [];
            this._eventCollection[event].push(listener);
            return this;
        },
        once: function (event, listener) {
            var self = this;

            function fn() {
                self.off(event, fn);
                listener.apply(this, arguments);
            }
            fn.listener = listener;
            this.on(event, fn);
            return this;
        },
        off: function (event, listener) {
            var listeners = undefined;
            if (!this._eventCollection || !(listeners = this._eventCollection[event])) {
                return this;
            }
            listeners.forEach(function (fn, i) {
                if (fn === listener || fn.listener === listener) {
                    listeners.splice(i, 1);
                }
            });
            if (listeners.length === 0) {
                delete this._eventCollection[event];
            }
            return this;
        },
        emit: function (event) {
            var _this = this,
                _len = arguments.length;
            for (_len, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key += 1) {
                args[_key - 1] = arguments[_key];
            }
            var listeners = undefined;
            if (!this._eventCollection || !(listeners = this._eventCollection[event])) {
                return this;
            }
            listeners = listeners.slice(0);
            listeners.forEach(function (fn) {
                return fn.apply(_this, args);
            });
            return this;
        }
    }
    global.Base = function () {
        this.preinitialize.apply(this, arguments);
        this.initialize.apply(this, arguments);
    };

    global.extend(Base.prototype, Emitter, {
        preinitialize: function () {},
        initialize: function () {}
    });

    global.Base.extend = inherits;

})(this);