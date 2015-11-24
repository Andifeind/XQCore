/* global FireTPL:false */
describe('Tmpl', function() {
	'use strict';

	describe('getTemplate', function() {
		it('Should throw an not precompiled error', function() {
			var getTemplateSpy = sinon.spy(XQCore.Tmpl, 'getTemplate');
			
			FireTPL._loadFile = FireTPL.loadFile;
			delete FireTPL.loadFile;

			expect(function() {
				XQCore.Tmpl.getTemplate('test');
			}).to.throwError(/FireTPL runtime is being used./);

			expect(getTemplateSpy).to.be.called();

			FireTPL.loadFile = FireTPL._loadFile;
			getTemplateSpy.restore();
		});
	});
});