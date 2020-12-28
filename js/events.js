(function (global) {
    var Events = {}, scope = {};
    var eventSplitter = /\s+/;
    var _listening;
    function Ctor() {};    
    var slice = [].slice;
    var property = function (key) { return function (obj) { return obj == null ? void 0 : obj[key]; }; };    
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1; var getLength = property('length'); var isArrayLike = function (collection) { var length = getLength(collection); return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX; };    
    function isObject(obj) {  return obj === Object(obj); }    
    function baseCreate(prototype) { if (!isObject(prototype)) return {}; if (Object.create) return Object.create(prototype); Ctor.prototype = prototype; var result = new Ctor(); Ctor.prototype = null; return result; }     
    function executeBound(sourceFunc, boundFunc, context, callingContext, args) { if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args); var self = baseCreate(sourceFunc.prototype); var result = sourceFunc.apply(self, args); if (isObject(result)) return result; return self; };		    
    function partial(func) { var boundArgs = slice.call(arguments, 1); var bound = function () { var position = 0, length = boundArgs.length; var args = Array(length); for (var i = 0; i < length; i++) { args[i] = boundArgs[i] === window ? arguments[position++] : boundArgs[i]; } while (position < arguments.length) args.push(arguments[position++]); return executeBound(func, bound, this, this, args); }; return bound; };
    function before(times, func) { var memo; return function () { if (--times > 0) { memo = func.apply(this, arguments); } if (times <= 1) func = null; return memo; } }
    const once = partial(before, 2);
    var idCounter = 0;
    function uniqueId(prefix) { var id = idCounter++; return prefix ? prefix + id : id; };
    ['Arguments', 'Array', 'String'].forEach(function (name) { this['is' + name] = function (obj) { return toString.call(obj) === '[object ' + name + ']'; } });
    function isEmpty(obj) { if (obj == null) return true; if (isArrayLike(obj) && (isArray(obj) || isString(obj) || isArguments(obj))) return obj.length === 0; return Object.keys(obj).length === 0; };
    function extend(destination, from) { for (var prop in from) { if (from[prop]) { destination[prop] = from[prop]; } } return destination; }
    function eventsApi(iteratee, events, name, callback, opts) { var i = 0,names;if (name && typeof name === 'object') {if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;for (names = Object.keys(name); i < names.length; i++) {events = eventsApi(iteratee, events, names[i], name[names[i]], opts);}} else if (name && eventSplitter.test(name)) {for (names = name.split(eventSplitter); i < names.length; i++) {events = iteratee(events, names[i], callback, opts);}} else {events = iteratee(events, name, callback, opts);}return events;};
    Events.on = function (name, callback, context) { this._events = eventsApi(onApi, this._events || {}, name, callback, { context: context, ctx: this, listening: _listening }); if (_listening) { var listeners = this._listeners || (this._listeners = {}); listeners[_listening.id] = _listening; _listening.interop = false; } return this; };
    Events.listenTo = function (obj, name, callback) { if (!obj) return this; var id = obj._listenId || (obj._listenId = uniqueId('l')); var listeningTo = this._listeningTo || (this._listeningTo = {}); var listening = _listening = listeningTo[id]; if (!listening) { this._listenId || (this._listenId = uniqueId('l')); listening = _listening = listeningTo[id] = new Listening(this, obj); } var error = tryCatchOn(obj, name, callback, this); _listening = void 0; if (error) throw error; if (listening.interop) listening.on(name, callback); return this; };
    function onApi(events, name, callback, options) { if (callback) { var handlers = events[name] || (events[name] = []); var context = options.context, ctx = options.ctx, listening = options.listening; if (listening) listening.count++; handlers.push({ callback: callback, context: context, ctx: context || ctx, listening: listening }); } return events; };
    function tryCatchOn(obj, name, callback, context) { try { obj.on(name, callback, context); } catch (e) { return e; } };
    Events.off = function (name, callback, context) { if (!this._events) return this; this._events = eventsApi(offApi, this._events, name, callback, { context: context, listeners: this._listeners }); return this; };
    Events.stopListening = function (obj, name, callback) { var listeningTo = this._listeningTo; if (!listeningTo) return this; var ids = obj ? [obj._listenId] : Object.keys(listeningTo); for (var i = 0; i < ids.length; i++) { var listening = listeningTo[ids[i]]; if (!listening) break; listening.obj.off(name, callback, this); if (listening.interop) listening.off(name, callback); } if (isEmpty(listeningTo)) this._listeningTo = void 0; return this; };    
	function offApi(events, name, callback, options) { if (!events) return; var context = options.context, listeners = options.listeners; var i = 0, names; if (!name && !context && !callback) { for (names = Object.keys(listeners); i < names.length; i++) { listeners[names[i]].cleanup(); } return; } names = name ? [name] : Object.keys(events); for (; i < names.length; i++) { name = names[i]; var handlers = events[name]; if (!handlers) break; var remaining = []; for (var j = 0; j < handlers.length; j++) { var handler = handlers[j]; if ( callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context ) { remaining.push(handler); } else { var listening = handler.listening; if (listening) listening.off(name, callback); } } if (remaining.length) { events[name] = remaining; } else { delete events[name]; } } return events; };	
    Events.once = function (name, callback, context) { var events = eventsApi(onceMap, {}, name, callback, this.off.bind(this)); if (typeof name === 'string' && context == null) callback = void 0; return this.on(events, callback, context); };	
    Events.listenToOnce = function (obj, name, callback) { var events = eventsApi(onceMap, {}, name, callback, this.stopListening.bind(this, obj)); return this.listenTo(obj, events); };	
    function onceMap(map, name, callback, offer) { if (callback) { var once = map[name] = once(function () { offer(name, once); callback.apply(this, arguments); }); once._callback = callback; } return map; };    
    Events.trigger = function (name) { if (!this._events) return this; var length = Math.max(0, arguments.length - 1); var args = Array(length); for (var i = 0; i < length; i++) args[i] = arguments[i + 1]; eventsApi(triggerApi, this._events, name, void 0, args); return this; }; 	
    function triggerApi(objEvents, name, callback, args) { if (objEvents) { var events = objEvents[name]; var allEvents = objEvents.all; if (events && allEvents) allEvents = allEvents.slice(); if (events) triggerEvents(events, args); if (allEvents) triggerEvents(allEvents, [name].concat(args)); } return objEvents; };
    function triggerEvents(events, args) { var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2]; switch (args.length) { case 0: while (++i < l)(ev = events[i]).callback.call(ev.ctx); return; case 1: while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1); return; case 2: while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2); return; case 3: while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return; default: while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args); return; } };
    function Listening(listener, obj) { this.id = listener._listenId; this.listener = listener; this.obj = obj; this.interop = true; this.count = 0; this._events = void 0; };
    Listening.prototype.on = Events.on;
    Listening.prototype.off = function (name, callback) { var cleanup; if (this.interop) { this._events = eventsApi(offApi, this._events, name, callback, { context: void 0, listeners: void 0 }); cleanup = !this._events; } else { this.count--; cleanup = this.count === 0; } if (cleanup) this.cleanup(); };	
    Listening.prototype.cleanup = function () { delete this.listener._listeningTo[this.obj._listenId]; if (!this.interop) delete this.obj._listeners[this.id]; };	

    Events.bind = Events.on;
    Events.unbind = Events.off;

    if(typeof global !== 'undefined'){
        global.Events = Events;
        // todo : i've copied the object into global, 
        // delete the old reference or build into target scope object using with statement
    }

})(this);