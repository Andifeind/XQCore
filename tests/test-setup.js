'use strict';

var methods = ['onopen', 'onmessage', 'onclose', 'send', 'connect'];
var SockJSMock = function() {
    methods.forEach(function(fn) {
        this[fn] = sinon.stub();
    }.bind(this));

    this.__constructor = sinon.stub();
    this.__constructor.apply(this, arguments);
};

methods.forEach(function(fn) {
    SockJSMock.prototype[fn] = function() {};
});

XQCore.__moduleCache.sockjs = SockJSMock;