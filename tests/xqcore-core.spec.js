describe.only('XQCore.Core', function() {
    'use strict';

    describe('XQCore', function() {
        it('There should be a XQCore instance', function() {
            expect(XQCore).to.be.an('object');
        });
    });

    describe('isPlainObject', function() {
        it('str should not be a plainObject', function() {
            inspect(XQCore.isPlainObject('test')).isFalse();
        });
    });
});
