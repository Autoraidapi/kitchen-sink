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



(function (Dispatch) {
    const slice = [].slice;
  
    const optionalParam = /\((.*?)\)/g;
    const namedParam = /(\(\?)?:\w+/g;
    const splatParam = /\*\w+/g;
    const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    const routeStripper = /^[#\/]|\s+$/g;
    const rootStripper = /^\/+|\/+$/g;
    const pathStripper = /#.*$/;
  
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
      
    function Ctor() {};
  
    function baseCreate(prototype) {
      if (!isObject(prototype)) return {};
      if (Object.create) return Object.create(prototype);
      Ctor.prototype = prototype;
      var result = new Ctor();
      Ctor.prototype = null;
      return result;
    }
  
    function createAssigner(keysFunc, defaults) {
      return function (obj) {
        var length = arguments.length;
        if (defaults) obj = Object(obj);
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
          var source = arguments[index],
            _keys = keysFunc(source),
            l = _keys.length;
          for (var i = 0; i < l; i++) {
            var key = _keys[i];
            if (!defaults || obj[key] === void 0) obj[key] = source[key];
          }
        }
        return obj;
      };
    }
  
      function names(obj){
          var result = [];
          for(var key in obj){
              result.push(key);
          }
          return result;
      }
      
      
      var extend = createAssigner(names);
    var extendOwn = createAssigner(Object.keys);
  
    function create(prototype, props) {
      var result = baseCreate(prototype);
      if (props) extendOwn(result, props);
      return result;
    }
  
    const Router = (Dispatch.Router = function (options) {
      options || (options = {});
      this.preinitialize.apply(this, arguments);
      if (options.routes) this.routes = options.routes;
      this._bindRoutes();
      this.initialize.apply(this, arguments);
    });
  
    extend(Router.prototype, Emitter.Events, {
      preinitialize: function () {},
      initialize: function () {},
      route: function (route, name, callback) {
        if (!isRegExp(route)) route = this._routeToRegExp(route);
        if (isFunction(name)) {
          callback = name;
          name = "";
        }
        if (!callback) callback = this[name];
        var router = this;
        Dispatch.history.route(route, function (fragment) {
          var args = router._extractParameters(route, fragment);
          if (router.execute(callback, args, name) !== false) {
            router.trigger.apply(router, ["route:" + name].concat(args));
            router.trigger("route", name, args);
            Dispatch.history.trigger("route", router, name, args);
          }
        });
        return this;
      },
  
      execute: function (callback, args, name) {
        if (callback) callback.apply(this, args);
      },
  
      navigate: function (fragment, options) {
        Dispatch.history.navigate(fragment, options);
        return this;
      },
  
      _bindRoutes: function () {
        if (!this.routes) return;
        this.routes = _.result(this, "routes");
        var route,
          routes = Object.keys(this.routes);
        while ((route = routes.pop()) != null) {
          this.route(route, this.routes[route]);
        }
      },
  
      _routeToRegExp: function (route) {
        route = route
          .replace(escapeRegExp, "\\$&")
          .replace(optionalParam, "(?:$1)?")
          .replace(namedParam, function (match, optional) {
            return optional ? match : "([^/?]+)";
          })
          .replace(splatParam, "([^?]*?)");
        return new RegExp("^" + route + "(?:\\?([\\s\\S]*))?$");
      },
  
      _extractParameters: function (route, fragment) {
        var params = route.exec(fragment).slice(1);
        return [].map(params, function (param, i) {
          if (i === params.length - 1) return param || null;
          return param ? decodeURIComponent(param) : null;
        });
      }
    });
  
    const History = (Dispatch.History = function () {
      this.handlers = [];
      this.checkUrl = this.checkUrl.bind(this);
      if (typeof window !== "undefined") {
        this.location = window.location;
        this.history = window.history;
      }
    });
  
    History.started = false;
  
    extend(History.prototype, Emitter.Events, {
      interval: 50,
  
      atRoot: function () {
        var path = this.location.pathname.replace(/[^\/]$/, "$&/");
        return path === this.root && !this.getSearch();
      },
  
      matchRoot: function () {
        var path = this.decodeFragment(this.location.pathname);
        var rootPath = path.slice(0, this.root.length - 1) + "/";
        return rootPath === this.root;
      },
  
      decodeFragment: function (fragment) {
        return decodeURI(fragment.replace(/%25/g, "%2525"));
      },
  
      getSearch: function () {
        var match = this.location.href.replace(/#.*/, "").match(/\?.+/);
        return match ? match[0] : "";
      },
  
      getHash: function (window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : "";
      },
  
      getPath: function () {
        var path = this.decodeFragment(
          this.location.pathname + this.getSearch()
        ).slice(this.root.length - 1);
        return path.charAt(0) === "/" ? path.slice(1) : path;
      },
  
      getFragment: function (fragment) {
        if (fragment == null) {
          if (this._usePushState || !this._wantsHashChange) {
            fragment = this.getPath();
          } else {
            fragment = this.getHash();
          }
        }
        return fragment.replace(routeStripper, "");
      },
  
      start: function (options) {
        if (History.started)
          throw new Error("App History has already been started");
        History.started = true;
        this.options = _.extend({
          root: "/"
        }, this.options, options);
        this.root = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._hasHashChange =
          "onhashchange" in window &&
          (document.documentMode === void 0 || document.documentMode > 7);
        this._useHashChange = this._wantsHashChange && this._hasHashChange;
        this._wantsPushState = !!this.options.pushState;
        this._hasPushState = !!(this.history && this.history.pushState);
        this._usePushState = this._wantsPushState && this._hasPushState;
        this.fragment = this.getFragment();
        this.root = ("/" + this.root + "/").replace(rootStripper, "/");
        if (this._wantsHashChange && this._wantsPushState) {
          if (!this._hasPushState && !this.atRoot()) {
            var rootPath = this.root.slice(0, -1) || "/";
            this.location.replace(rootPath + "#" + this.getPath());
            return true;
          } else if (this._hasPushState && this.atRoot()) {
            this.navigate(this.getHash(), {
              replace: true
            });
          }
        }
        if (
          !this._hasHashChange &&
          this._wantsHashChange &&
          !this._usePushState
        ) {
          this.iframe = document.createElement("iframe");
          this.iframe.src = "javascript:0";
          this.iframe.style.display = "none";
          this.iframe.tabIndex = -1;
          var body = document.body;
          var iWindow = body.insertBefore(this.iframe, body.firstChild)
            .contentWindow;
          iWindow.document.open();
          iWindow.document.close();
          iWindow.location.hash = "#" + this.fragment;
        }
        var addEventListener =
          window.addEventListener ||
          function (eventName, listener) {
            return attachEvent("on" + eventName, listener);
          };
        if (this._usePushState) {
          addEventListener("popstate", this.checkUrl, false);
        } else if (this._useHashChange && !this.iframe) {
          addEventListener("hashchange", this.checkUrl, false);
        } else if (this._wantsHashChange) {
          this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }
        if (!this.options.silent) return this.loadUrl();
      },
  
      stop: function () {
        var removeEventListener =
          window.removeEventListener ||
          function (eventName, listener) {
            return detachEvent("on" + eventName, listener);
          };
        if (this._usePushState) {
          removeEventListener("popstate", this.checkUrl, false);
        } else if (this._useHashChange && !this.iframe) {
          removeEventListener("hashchange", this.checkUrl, false);
        }
        if (this.iframe) {
          document.body.removeChild(this.iframe);
          this.iframe = null;
        }
        if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
        History.started = false;
      },
  
      route: function (route, callback) {
        this.handlers.unshift({
          route: route,
          callback: callback
        });
      },
  
      checkUrl: function (e) {
        var current = this.getFragment();
        if (current === this.fragment && this.iframe) {
          current = this.getHash(this.iframe.contentWindow);
        }
        if (current === this.fragment) return false;
        if (this.iframe) this.navigate(current);
        this.loadUrl();
      },
  
      loadUrl: function (fragment) {
        if (!this.matchRoot()) return false;
        fragment = this.fragment = this.getFragment(fragment);
        return _.some(this.handlers, function (handler) {
          if (handler.route.test(fragment)) {
            handler.callback(fragment);
            return true;
          }
        });
      },
  
      navigate: function (fragment, options) {
        if (!History.started) return false;
        if (!options || options === true) options = {
          trigger: !!options
        };
        fragment = this.getFragment(fragment || "");
        var rootPath = this.root;
        if (fragment === "" || fragment.charAt(0) === "?") {
          rootPath = rootPath.slice(0, -1) || "/";
        }
        var url = rootPath + fragment;
        fragment = fragment.replace(pathStripper, "");
        var decodedFragment = this.decodeFragment(fragment);
        if (this.fragment === decodedFragment) return;
        this.fragment = decodedFragment;
        if (this._usePushState) {
          this.history[options.replace ? "replaceState" : "pushState"]({},
            document.title,
            url
          );
        } else if (this._wantsHashChange) {
          this._updateHash(this.location, fragment, options.replace);
          if (
            this.iframe &&
            fragment !== this.getHash(this.iframe.contentWindow)
          ) {
            var iWindow = this.iframe.contentWindow;
            if (!options.replace) {
              iWindow.document.open();
              iWindow.document.close();
            }
            this._updateHash(iWindow.location, fragment, options.replace);
          }
        } else {
          return this.location.assign(url);
        }
        if (options.trigger) return this.loadUrl(fragment);
      },
  
      _updateHash: function (location, fragment, replace) {
        if (replace) {
          var href = location.href.replace(/(javascript:|#).*$/, "");
          location.replace(href + "#" + fragment);
        } else {
          location.hash = "#" + fragment;
        }
      }
    });
  
    // might change name later if a Library namespace is chosen
    Dispatch.history = new History();
  
    function extend(protoProps, staticProps) {
      var parent = this;
      var child;
      if (protoProps && _.has(protoProps, "constructor")) {
        child = protoProps.constructor;
      } else {
        child = function () {
          return parent.apply(this, arguments);
        };
      }
      extend(child, parent, staticProps);
      child.prototype = create(parent.prototype, protoProps);
      child.prototype.constructor = child;
      child.__super__ = parent.prototype;
      return child;
    };
  
    Router.extend = History.extend = extend;
  
    var urlError = function () {
      throw new Error('A "url" property or function must be specified');
    };
  
    // exporting for test in current stage
    if (typeof window !== "undefined") {
      window.Dispatch = Dispatch;
    }
  })({});