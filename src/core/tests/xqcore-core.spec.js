describe.only('XQCore.Core', function() {
	'use strict';

	var $ = XQCore.require('jquery');

	describe('loadFile', function() {
		it('Should load a file from the server', function() {
			var ajaxSpy = sinon.spy($, 'ajax');

			var file = XQCore.loadFile('SpecRunner.html');
			expect(ajaxSpy).was.called();
			expect(ajaxSpy).was.calledWithMatch({
				url: 'SpecRunner.html',
				async: false
			});
			
			expect(file).to.contain('<html');
			ajaxSpy.restore();
		});
	});
});