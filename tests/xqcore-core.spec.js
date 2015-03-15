describe('XQCore.Core', function() {
	'use strict';

	describe('XQCore', function() {
		it('There should be a XQCore instance', function() {
			expect(XQCore).to.be.an('object');
		});
	});

    describe('XQCore.require', function() {
        it('Should return a lib', function() {
            expect(XQCore.require).to.be.a('function');

            var testlib = {};
            window.testlib = testlib;

            XQCore.modules.testlib = {
                win: 'testlib',
                cjs: 'testlib'
            };

            expect(XQCore.require('testlib')).to.equal(testlib);
        });
    });
});