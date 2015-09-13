'use strict';

var SockJS = function() {
    return {
        onopen: function() {

        },
        onmessage: function() {

        },
        onclose: function() {

        }
    };
};

if (typeof module === 'object' && module.exports) {
    module.exports = SockJS;
}
else {
    window.SockJS = SockJS;
}