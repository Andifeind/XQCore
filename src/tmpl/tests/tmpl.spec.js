describe.only('Tmpl', function() {
	'use strict';

	beforeEach(function() {

	});

	afterEach(function() {

	});

	describe('getIndention', function() {
		it('Should get the number of indention', function() {
			var tmpl = new XQCore.Tmpl();
			var indention = tmpl.getIndention('\t\tBla');
			expect(indention).to.eql(2);
		});

		it('Should get indention from an empty string', function() {
			var tmpl = new XQCore.Tmpl();
			var indention = tmpl.getIndention('');
			expect(indention).to.eql(0);
		});

		it('Should get indention from a null object', function() {
			var tmpl = new XQCore.Tmpl();
			var indention = tmpl.getIndention(null);
			expect(indention).to.eql(0);
		});
	});

	describe('stripAttributes', function() {
		it('Should strib all attributes from a string', function() {
			var tmpl = new XQCore.Tmpl();
			var attrs = tmpl.stripAttributes(' foo=bar bla=blubb');
			expect(attrs).to.eql({
				attrs: ['foo="bar"', 'bla="blubb"'],
				events: []
			});
		});

		it('Should strib all attributes from a empty string', function() {
			var tmpl = new XQCore.Tmpl();
			var attrs = tmpl.stripAttributes('');
			expect(attrs).to.eql(null);
		});

		it('Should strib all attributes from a null object', function() {
			var tmpl = new XQCore.Tmpl();
			var attrs = tmpl.stripAttributes(null);
			expect(attrs).to.eql(null);
		});

		it('Should strib all attributes and events from a string', function() {
			var tmpl = new XQCore.Tmpl();
			var attrs = tmpl.stripAttributes(' foo=bar bla=blubb onShow=myEvent');
			expect(attrs).to.eql({
				attrs: ['foo="bar"', 'bla="blubb"'],
				events: [['onShow', 'myEvent']]
			});
		});

		it('Should strib all events from a string', function() {
			var tmpl = new XQCore.Tmpl();
			var attrs = tmpl.stripAttributes(' onFoo=bar onBla=blubb onShow=myEvent');
			expect(attrs).to.eql({
				attrs: [],
				events: [['onFoo', 'bar'], ['onBla', 'blubb'], ['onShow', 'myEvent']]
			});
		});
	});

	describe('precompile', function() {
		it('Should precompile a tmpl string', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		div id=myDiv\n';
			template += '		div id=mySecondDiv class=myClass\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template();
			expect(html).to.equal(
				'<html><head></head><body><div id="myDiv"></div>' +
				'<div id="mySecondDiv" class="myClass"></div>' +
				'</body></html>'
			);
		});

		it('Should precompile a tmpl string with inline text', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		div id=myDiv\n';
			template += '		div id=mySecondDiv class=myClass\n';
			template += '			Hello World\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template();
			expect(html).to.equal(
				'<html><head></head><body><div id="myDiv"></div>' +
				'<div id="mySecondDiv" class="myClass">Hello World</div>' +
				'</body></html>'
			);
		});

		it('Should precompile a tmpl string with line attribute', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		div id=myDiv\n';
			template += '		div\n';
			template += '			id=mySecondDiv\n';
			template += '			class=myClass\n';
			template += '			\n';
			template += '			Hello World\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template();
			expect(html).to.equal(
				'<html><head></head><body><div id="myDiv"></div>' +
				'<div id="mySecondDiv" class="myClass">Hello World</div>' +
				'</body></html>'
			);
		});
	});
});