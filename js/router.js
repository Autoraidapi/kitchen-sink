(function () {
    
    // import Events
    // import protocol

    var Router = (Application.Router = function (options) {
        options || (options = {});
        this.preinitialize.apply(this, arguments);
        if (options.routes) this.routes = options.routes;
        this._bindRoutes();
        this.initialize.apply(this, arguments);
    });

    extend(Router.prototype, Events, {
        preinitialize : function(){},
        initialize : function(){}
    });

    Router.extend = inherits;

    window.Application = window.Application || {};
    window.Application.Router = Router;

})();