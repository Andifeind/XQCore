'use strict';

var map = new Map(),
    obj = {};

var asMap = function() {
    map.forEach(function(value, key) {

    });
};

var asArray = function() {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var item = obj[key];
        }
    }
};

before(function() {
    this.loop(1000, function(index) {
        map.set('test-' + index, 'testvalue');
        obj['test-' + index] = 'testvalue';
    });
});

test('Map', function() {
    asMap();
});

test('Object', function() {
    asArray();
});