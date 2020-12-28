(function(){
    
    // import Events
    // import protocol

    var History = (Application.History = function () {
        this.handlers = [];
        this.checkUrl = this.checkUrl.bind(this);
        if (typeof window !== "undefined") {
            this.location = window.location;
            this.history = window.history;
        }
    });

    extend(History.prototype, Events, {
        
    });

    History.extend = inherits;

    window.Application = window.Application || {};
    window.Application.History = History;

})();
