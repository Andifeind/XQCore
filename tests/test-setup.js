'use strict';

console.log('MOCK! -------------------------');
var methods = ['onopen', 'onmessage', 'onclose', 'send'];
var SockJSMock = function() {
    console.log('Init Mock');
    methods.forEach(function(fn) {
        this[fn] = sinon.stub();
    });
};

methods.forEach(function(fn) {
    SockJSMock.prototype[fn] = function() {};
});

XQCore.__moduleCache.sockjs = SockJSMock;