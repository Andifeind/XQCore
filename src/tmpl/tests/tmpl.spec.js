describe('Tmpl', function() {
	beforeEach(function() {

	});

	afterEach(function() {

	});

	descibe('precompile', function() {
		it('Should precompile a tmpl string', function() {
			var tmpl = 'html';
			tmpl += '	head';
			tmpl += '	body';
			tmpl += '		div id=myDiv';
			tmpl += '		div id=mySecondDiv class=myClass';

			var template = XQCore.Tmpl.precompile(tmpl);
			var html = template();
			expect(html).to.equal(
				'<html><head></head><body><div id="myDiv"></div>' +
				'<div id="mySecondDiv" class="myClass"></div>' +
				'</body></html>'
			);
		});
	});
});