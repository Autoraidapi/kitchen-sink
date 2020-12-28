// really just wanted to write some code.. so I started backbones router class which needs history and events
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

    History.started = false;

    extend(History.prototype, Events, {
        
        interval : 50,
        
        getHash: function (window) {
            var match = (window || this).location.href.match(/#(.*)$/);
            return match ? match[1] : "";
        },

        checkUrl : function(){},
        
        start : function(){
            History.started = true;
            window.addEventListener('hashchange');
        },

        stop : function(){
            window.removeEventListener('hashchange');  
            if (this.iframe) {
                document.body.removeChild(this.iframe);
                this.iframe = null;
            }
            History.started = false;                                    
        },

        proxy : function(){
            this.iframe = document.createElement("iframe");
            this.iframe.src = "javascript:0";
            this.iframe.style.display = "none";
            this.iframe.tabIndex = -1;
            var body = document.body;
            var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
            iWindow.document.open();
            iWindow.document.close();
            iWindow.location.hash = "#";
        }

    });

    History.extend = inherits;

    window.Application = window.Application || {};
    window.Application.History = History;

})();
