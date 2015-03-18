'use strict';

var methods = ['onopen', 'onmessage', 'onclose', 'send'];
var SockJSMock = function() {
    methods.forEach(function(fn) {
        this[fn] = sinon.stub();
    }.bind(this));
};

methods.forEach(function(fn) {
    SockJSMock.prototype[fn] = function() {};
});

XQCore.__moduleCache.sockjs = SockJSMock;