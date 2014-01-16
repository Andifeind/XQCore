/* global $:false */
var parseHTML = function(tmpl) {
	'use strict';

	tmpl = $.parseHTML(tmpl);
	var $el = $(tmpl),
		pointer = {};

	$el.find('span').each(function() {
		
		var p = document.createTextNode('Hello'),
			k = $(this).attr('class');
		pointer[k] = p;

		console.log('Replace with');

		$(this).replaceWith(p);
	});

	pointer.title.nodeValue = 'Title';
	pointer.description.nodeValue = 'Description';

	return $el.get(0).outerHTML;
};

describe('DOM', function() {
	'use strict';

	var template;

	beforeEach(function() {
		template = function(data) {
			var scope001 = function(item) {
				return '<li>' + item.name + '</li>';
			};
			var str = '<div class="title"></div>' +
				'<ul>' + scope001(data) + '</ul>';

			return str;
		};
	});

	afterEach(function() {

	});

	describe('parseTemplate', function() {
		it('Should parse a template', function() {
			var tmpl = '<div><span class="title"></span><br><span class="description"></span></div>';
			var source = parseHTML(tmpl);

			expect(source).to.eql('<div>Title<br>Description</div>');
		});

		it('Should parse a template scope', function() {
			var tmpl = '<div><span class="title"></span><br><span class="description"></span></div>' + 
				'<ul class="scope001"><li><span class="item.name"></span></li></ul>';
			var source = parseHTML(tmpl);

			expect(source).to.eql('<div>Title<br>Description</div>');
		});
	});
});