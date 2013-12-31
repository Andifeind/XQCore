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

	describe('handleIndention', function() {
		it('Should handle indention on indent', function() {
			var tmpl = new XQCore.Tmpl();
			tmpl.indention = 2;
			tmpl.closer = ['a', 'b', 'c'];
			tmpl.handleIndention('\t\t\t');

			expect(tmpl.indention).to.be(3);
			expect(tmpl.closer).to.length(3);
			expect(tmpl.closer).to.eql(['a', 'b', 'c']);
		});

		it('Should handle indention on outdent', function() {
			var tmpl = new XQCore.Tmpl();
			tmpl.indention = 2;
			tmpl.closer = ['a', 'b', 'c'];
			tmpl.handleIndention('\t');

			expect(tmpl.indention).to.be(1);
			expect(tmpl.closer).to.length(1);
			expect(tmpl.closer).to.eql(['a']);
		});

		it('Should handle indention on same indention', function() {
			var tmpl = new XQCore.Tmpl();
			tmpl.indention = 2;
			tmpl.closer = ['a', 'b', 'c'];
			tmpl.handleIndention('\t\t');

			expect(tmpl.indention).to.be(2);
			expect(tmpl.closer).to.length(2);
			expect(tmpl.closer).to.eql(['a', 'b']);
		});

		it('Should handle 5 step outdention', function() {
			var tmpl = new XQCore.Tmpl();
			tmpl.indention = 8;
			tmpl.closer = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
			tmpl.handleIndention('\t\t\t');

			expect(tmpl.indention).to.be(3);
			expect(tmpl.closer).to.length(3);
			expect(tmpl.closer).to.eql(['a', 'b', 'c']);
		});
	});

	describe('append', function() {
		it('Should append to out str', function() {
			var tmpl = new XQCore.Tmpl();
			tmpl.out = '';
			tmpl.append('str', '<div>');
			tmpl.append('code', 'if(data.bla){');
			tmpl.append('str', 'Hello');
			tmpl.append('code', '}');
			tmpl.append('code', 'else{');
			tmpl.append('str', 'Good bye');
			tmpl.append('code', '}');
			tmpl.append('str', '</div>');
			expect(tmpl.out).to.equal('s+=\'<div>\';if(data.bla){s+=\'Hello\';}else{s+=\'Good bye\';}s+=\'</div>');
		});
	});

	describe('check pattern', function() {
		it('Should match an empty line', function() {
			var tmpl = new XQCore.Tmpl();
			var match = tmpl.pattern.exec('\t\t\t');
			expect(/^\s*$/.test(match[0])).to.be(true);
		});

		it('Should match a line comment', function() {
			var tmpl = new XQCore.Tmpl();
			console.log('PAT', tmpl.pattern.source);
			var match = tmpl.pattern.exec('\t\t\t//I\'m a comment');
			console.log('MATCH', match);
			console.log('MATCH', match.input);
			expect(match.slice(1)).to.eql([
				'\t\t\t',
				'//I\'m a comment',
				undefined,
				undefined,
				undefined,
				undefined
			]);
		});

		it('Should match a statement', function() {
			var tmpl = new XQCore.Tmpl();
			var match = tmpl.pattern.exec('\t\t\tif $bla');
			expect(match.slice(1)).to.eql([
				'\t\t\t',
				undefined,
				'if',
				undefined,
				undefined,
				' $bla'
			]);
		});

		it('Should match a line attribute', function() {
			var tmpl = new XQCore.Tmpl();
			var match = tmpl.pattern.exec('\t\t\tfoo=bar');
			expect(match.slice(1)).to.eql([
				'\t\t\t',
				undefined,
				undefined,
				'foo=bar',
				undefined,
				undefined
			]);
		});

		it('Should match a line attribute, value is enclosed with doublequotes', function() {
			var tmpl = new XQCore.Tmpl();
			var match = tmpl.pattern.exec('\t\t\tbla="Super bla"');
			expect(match.slice(1)).to.eql([
				'\t\t\t',
				undefined,
				undefined,
				'bla="Super bla"',
				undefined,
				undefined
			]);
		});

		it('Should match a line attribute, value is enclosed with singlequotes', function() {
			var tmpl = new XQCore.Tmpl();
			var match = tmpl.pattern.exec('\t\t\tbla=\'Super bla\'');
			expect(match.slice(1)).to.eql([
				'\t\t\t',
				undefined,
				undefined,
				'bla=\'Super bla\'',
				undefined,
				undefined
			]);
		});

		it('Should match a tag', function() {
			var tmpl = new XQCore.Tmpl();
			var match = tmpl.pattern.exec('\t\t\tdiv');
			expect(match.slice(1)).to.eql([
				'\t\t\t',
				undefined,
				undefined,
				undefined,
				'div',
				undefined
			]);
		});

		it('Should match a tag with attributes', function() {
			var tmpl = new XQCore.Tmpl();
			var match = tmpl.pattern.exec('\t\t\tdiv id="myDiv class="bla blubb"');
			expect(match.slice(1)).to.eql([
				'\t\t\t',
				undefined,
				undefined,
				undefined,
				'div',
				' id="myDiv class="bla blubb"'
			]);
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

	describe('injectClass', function() {
		it('Should inject a class into the last tag', function() {
			var tmpl = new XQCore.Tmpl();
			tmpl.out = '<div><span>';
			tmpl.injectClass('injected');
			expect(tmpl.out).to.equal('<div><span class="injected">');
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

		it('Should precompile a tmpl string with an if statement', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		if $sayit\n';
			template += '			div\n';
			template += '				Hello World\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template({
				sayit: true
			});
			expect(html).to.equal(
				'<html><head></head><body><div>Hello World</div>' +
				'</body></html>'
			);
		});

		it('Should precompile a tmpl string with a truthy if..else statement', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		if $sayit\n';
			template += '			div\n';
			template += '				Hello World\n';
			template += '		else\n';
			template += '			div\n';
			template += '				Good bye\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template({
				sayit: true
			});
			expect(html).to.equal(
				'<html><head></head><body><div>Hello World</div>' +
				'</body></html>'
			);
		});

		it('Should precompile a tmpl string with a falsy if..else statement', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		if $sayit\n';
			template += '			div\n';
			template += '				Hello World\n';
			template += '		else\n';
			template += '			div\n';
			template += '				Good bye\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template({
				sayit: false
			});
			expect(html).to.equal(
				'<html><head></head><body><div>Good bye</div>' +
				'</body></html>'
			);
		});

		it('Should precompile a tmpl string with an truthy unless statement', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		unless $sayit\n';
			template += '			div\n';
			template += '				Hello World\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template({
				sayit: true
			});
			expect(html).to.equal(
				'<html><head></head><body>' +
				'</body></html>'
			);
		});

		it('Should precompile a tmpl string with an falsy unless statement', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		unless $sayit\n';
			template += '			div\n';
			template += '				Hello World\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template({
				sayit: false
			});
			expect(html).to.equal(
				'<html><head></head><body><div>Hello World</div>' +
				'</body></html>'
			);
		});

		it('Should precompile a tmpl string with an falsy each statement', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		each $listing\n';
			template += '			div\n';
			template += '				Hello World\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template({
				listing: undefined
			});
			expect(html).to.equal(
				'<html><head></head><body class="xq-scope xq-scope001">' +
				'</body></html>'
			);
		});

		it('Should precompile a tmpl string with an truthy each statement', function() {
			var template = 'html\n';
			template += '	head\n';
			template += '	body\n';
			template += '		each $listing\n';
			template += '			span\n';
			template += '				$name\n';

			var tmpl = new XQCore.Tmpl();
			template = tmpl.precompile(template);
			var html = template({
				listing: [
					{name: 'Andi'},
					{name: 'Donnie'}
				]
			});
			expect(html).to.equal(
				'<html><head></head><body class="xq-scope xq-scope001">' +
				'<span>Andi</span><span>Donnie</span>' +
				'</body></html>'
			);
		});
	});
});