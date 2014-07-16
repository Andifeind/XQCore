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

        $(this).replaceWith(p);
    });

    pointer.title.nodeValue = 'Title';
    pointer.description.nodeValue = 'Description';

    return $el.get(0).outerHTML;
};

describe('DOM', function() {
    'use strict';
    describe('parseTemplate', function() {
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

    describe('DOM func vs innerHTML vs jQUery', function() {
        var tmpl1,
            tmpl2,
            tmpl3,
            durations = 1;

        it('Should create a html template using jQuery', function() {
            for (var i = 0; i < durations; i++) {
                tmpl1 = $($.parseHTML('<section><h1>Hello World</h1>' +
                '<ul></ul></section>'));

                tmpl1.find('ul')
                    .append($.parseHTML('<li>Orange</li>'))
                    .append($.parseHTML('<li>Purple</li>'))
                    .append($.parseHTML('<li>Lime</li>'));
            }

            tmpl1 = tmpl1.get(0).outerHTML;
        });

        it('Should create a html template using innerHTML', function() {
            for (var i = 0; i < durations; i++) {
                tmpl2 = document.createElement('div');
                tmpl2.innerHTML = '<section><h1>Hello World</h1>' +
                '<ul></ul></section>';

                var t = tmpl2.getElementsByTagName('ul')[0];
                var d1 = document.createElement('div');
                d1.innerHTML += '<li>Orange</li>';
                t.appendChild(d1.firstChild);
                var d2 = document.createElement('div');
                d2.innerHTML += '<li>Purple</li>';
                t.appendChild(d2.firstChild);
                var d3 = document.createElement('div');
                d3.innerHTML += '<li>Lime</li>';
                t.appendChild(d3.firstChild);
            }

            tmpl2 = tmpl2.innerHTML;
        });

        it('Should create a html template using DOM functions', function() {
            for (var i = 0; i < durations; i++) {
                tmpl3 = document.createElement('section');
                tmpl3.appendChild(document.createElement('h1')).innerHTML = 'Hello World';
                var ul = document.createElement('ul');
                var d1 = document.createElement('li');
                ul.appendChild(d1).innerHTML = 'Orange';

                var d2 = document.createElement('li');
                ul.appendChild(d2).innerHTML = 'Purple';
                var d3 = document.createElement('li');
                ul.appendChild(d3).innerHTML = 'Lime';
                
                tmpl3.appendChild(ul);
            }

            tmpl3 = tmpl3.outerHTML;
        });

        it('All templates should be equal', function() {
            // console.log('HTML 1', tmpl1);
            // console.log('HTML 2', tmpl2);
            // console.log('HTML 3', tmpl3);

            expect(tmpl1).to.eql(tmpl2);
            expect(tmpl1).to.eql(tmpl3);
        });

        /*
        Should create a html template using jQuery (6842ms)
        Should create a html template using innerHTML (1680ms)
        Should create a html template using DOM functions (2271ms)

         */
    });
});