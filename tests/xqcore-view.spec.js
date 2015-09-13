/*global $:false, FireTPL:false */
describe('XQCore View', function() {
    'use strict';

    describe('constructor', function() {
        it('Should initialize a view', function() {
            var view = new XQCore.View();
            expect(view).to.be.a(XQCore.View);
        });

        it('Should get a view name from first arg', function() {
            var view = new XQCore.View('Test');
            expect(view.name).to.equal('TestView');
        });

        it('Should get a view name from conf object', function() {
            var view = new XQCore.View({
                name: 'Test'
            });

            expect(view.name).to.equal('TestView');
        });

        it('Should set a default view name', function() {
            var view = new XQCore.View();
            expect(view.name).to.equal('NamelessView');
        });

        it('Should get a view name from conf object with init func', function() {
            var view = new XQCore.View(function (self) {
                self.name = 'Test';
            });

            expect(view.name).to.equal('TestView');
        });
    });

    describe('registerListener', function() {
        it('Should register listener for browser events', function() {
            var bindStub = sinon.stub($.fn, 'bind');
            
            var el = '<div id="myDiv" on="show:show">' +
                '<button data-filter="asc" on="click:filter">Filter ascend</button>' +
                '<button data-filter="desc" on="click:filter">Filter descend</button>' +
                '</div>';

            var $el = $($.parseHTML('<div>')).append($.parseHTML(el));

            var view = new XQCore.View();
            view.registerListener($el);

            expect($el.html()).to.eql('<div id="myDiv">' +
                '<button data-filter="asc">Filter ascend</button>' +
                '<button data-filter="desc">Filter descend</button>' +
                '</div>');

            expect(bindStub).to.be.calledThrice();
            expect(bindStub).to.be.calledWith('show');
            expect(bindStub).to.be.calledWith('click');
            bindStub.restore();
        });

        it('Should serialize form data on a submit event', function() {
            var bindStub = sinon.stub($.fn, 'bind');
            var el = '<form on="submit:save"><input type="hidden" name="test" value="123">' +
                '<input type="text" name="name" value="Andi">' +
                '<input type="checkbox" name="isCool" checked="checked" value="1">' +
                '<input type="radio" name="likes" value="Tea">' +
                '<input type="radio" name="likes" value="Coffee" checked="checked">' +
                '<textarea name="msg">Hello World</textarea>' +
                '<select name="fruits"><option value="apple">Apple</option>' +
                '<option value="banana">Banana</option></select></form>';

            var $el = $($.parseHTML(el));

            var view = new XQCore.View();
            view.registerListener($el);

            expect(bindStub).to.be.calledOnce();
            bindStub.restore();
        });

        it('Should serialize multiple checkboxes', function() {
            var html = '<form>' +
                '<input type="checkbox" name="browser[]" value="Firefox" checked="checked">' +
                '<input type="checkbox" name="browser[]" value="Opera" checked="checked">' +
                '<input type="checkbox" name="browser[]" value="Chrome" checked="checked">' +
                '</form>';

            var $el = $($.parseHTML(html));
            var view = new XQCore.View();
            var data = view.serializeForm($el);

            expect(data).to.eql({
                browser: ['Firefox', 'Opera', 'Chrome']
            });
        });
    });

    describe('ready', function() {
        it('Should call functions if state is ready', function() {
            var fn = sinon.stub();
            var view = new XQCore.View('test');

            view.isReady = false;
            view.ready(fn);
            expect(fn).to.be.notCalled();

            //Set ready state
            view.__setReadyState();
            expect(fn).to.be.calledOnce();
            expect(view.__readyCallbacks).to.have.length(0);
        });

        it('Should call functions immediately because state is ready', function() {
            var fn = sinon.stub();
            var view = new XQCore.View('test');

            view.isReady = false;
            view.ready(fn);
            expect(fn).to.be.notCalled();

            //Set ready state
            view.__setReadyState();
            expect(fn).to.be.calledOnce();
            expect(view.__readyCallbacks).to.have.length(0);
        });
    });

    describe('__createViewElement', function() {
        var view;
        beforeEach(function() {
            var View = function() {

            };

            View.prototype = XQCore.View.prototype;
            view = new View();
        });

        it('Should create a view element. Element type based on container element type', function() {
            var tag = view.__createViewElement();

            expect(tag).to.be.a(Element);
            expect(tag).to.be.a(HTMLDivElement);
        });

        it('Should create a section element when parent is a body element', function() {
            view.ct = { tagName: 'BODY' };
            var tag = view.__createViewElement();

            expect(tag).to.be.a(Element);
            expect(tag.tagName).to.eql('SECTION');
        });

        it('Should create a tbody element when parent is a table element', function() {
            view.ct = { tagName: 'TABLE' };
            var tag = view.__createViewElement();

            expect(tag).to.be.a(Element);
            expect(tag.tagName).to.eql('TBODY');
        });

        it('Should create a li element when parent is a ul element', function() {
            view.ct = { tagName: 'UL' };
            var tag = view.__createViewElement();

            expect(tag).to.be.a(Element);
            expect(tag.tagName).to.eql('LI');
        });

        it('Should create a div element when parent tag type any other element', function() {
            view.ct = { tagName: 'ANYOTHER' };
            var tag = view.__createViewElement();

            expect(tag).to.be.a(Element);
            expect(tag.tagName).to.eql('DIV');
        });

        it('Should create a element based on the tag option', function() {
            view.ct = { tagName: 'SECTION' };
            view.tag = 'div';
            var tag = view.__createViewElement();

            expect(tag).to.be.a(Element);
            expect(tag.tagName).to.eql('DIV');
        });
    });

    describe('__createView', function() {
        it.skip('Should create a view', function(done) {
            var view = new XQCore.View(function() {

            });

            view.ready(function() {
                expect(view.ct).to.be.a(Element);
                expect(view.el).to.be.a(Element);
                expect(view.$ct).to.be.a($);
                expect(view.$el).to.be.a($);
                expect(view.el.parentNode).to.be(document.body);
                done();
            });
        });

        it('Should set predefined class names', function(done) {
            var view = new XQCore.View('test', function(self) {
                self.className = 'test1 test2';
            });

            view.ready(function() {
                expect(view.el.className).to.eql('xq-view xq-test-view test1 test2');
                done();
            });
        });

        it('Should set an id attribute', function(done) {
            var view = new XQCore.View('test', function(self) {
                self.id = 'test1';
            });

            view.ready(function() {
                expect(view.el.id).to.eql('test1');
                expect(view.el.getAttribute('id')).to.eql('test1');
                done();
            });
        });

        it('Should set the view hidden', function(done) {
            var view = new XQCore.View('test', function(self) {
                self.hidden = true;
            });

            view.ready(function() {
                expect(view.el.className).to.contain('xq-hidden');
                expect(view.el.style.display).to.eql('none');
                done();
            });
        });
    });

    describe.skip('render', function() {
        var container,
            view;

        beforeEach(function() {
            container = document.createElement('div');
            
            view = new XQCore.View('test', function(self) {
                self.container = container;
                self.template = function(data) {
                    return '<span>' + data.a + '</span>';
                };
            });
        });

        it('Should render a view', function(done) {
             var data = { a: 'AA' };

             view.ready(function() {
                view.render(data);
                expect(view.ct.innerHTML).to.eql('<div class="xq-view xq-test-view"><span>AA</span></div>');
                done();
             });
        });

        it('Should re-render a view', function(done) {
             var data = { a: 'AA' };

             view.ready(function() {
                view.render(data);
                expect(view.ct.innerHTML).to.eql('<div class="xq-view xq-test-view"><span>AA</span></div>');
                view.render({ a: 'BB'});
                expect(view.ct.innerHTML).to.eql('<div class="xq-view xq-test-view"><span>BB</span></div>');
                done();
             });
        });

        it('Should emit a content.change event', function(done) {
            var onChangeCb = sinon.stub();

            view.on('content.change', onChangeCb);

            view.ready(function() {
                view.render({ a: 'AA'});
                expect(view.ct.innerHTML).to.eql('<div class="xq-view xq-test-view"><span>AA</span></div>');
                expect(onChangeCb).to.be.calledOnce();
                expect(onChangeCb).to.be.calledWith({ a: 'AA'});
                done();
            });
        });

        it('Should render a view without any data', function(done) {
            var onChangeCb = sinon.stub();
            view.on('content.change', onChangeCb);

            view.ready(function() {
                view.render(undefined);
                expect(view.ct.innerHTML).to.eql('<div class="xq-view xq-test-view"><span>undefined</span></div>');
                expect(onChangeCb).to.be.calledOnce();
                expect(onChangeCb).to.be.calledWith(undefined);
                done();
            });
        });
    });

    describe.skip('onStateChange', function() {
        var container,
            view;

        beforeEach(function() {
            container = document.createElement('div');
            
            view = new XQCore.View('test', function(self) {
                self.container = container;
                self.template = function(data) {
                    return '<span>Test view</span>';
                };

            });
        });

        it('Should set the state of the coupled model or list as a view class', function(done) {
            view.ready(function() {
                view.render();
                view.onStateChange('test1');
                expect(view.el.className).to.contain('xq-state-test1');
                done();
            });
        });

        it('Should replace an old state with a new one', function(done) {
            view.ready(function() {
                view.render();
                view.onStateChange('test1');
                expect(view.el.className).to.contain('xq-state-test1');
                view.onStateChange('test2');
                expect(view.el.className).not.to.contain('xq-state-test1');
                expect(view.el.className).to.contain('xq-state-test2');
                done();
            });
        });
    });

    describe.skip('parse using scopetags', function() {
        var view,
            presenter,
            simpleTmpl,
            regularTmpl,
            data;

        beforeEach(function() {
            view = new XQCore.View();
            presenter = new XQCore.Presenter();

            view.init(presenter);

            simpleTmpl = FireTPL.compile('section\n' +
                '    h1 $title\n' +
                '    ul class=listing\n' +
                '        :each $listing\n' +
                '            li\n' +
                '                span class=color $color\n' +
                '', {
                    scopeTags: true
                }
            );

            regularTmpl = FireTPL.compile('section\n' +
                '    h1 $title\n' +
                '    ul class=listing\n' +
                '        :each $listing\n' +
                '            li\n' +
                '                :if $image\n' +
                '                    img data-src=$src\n' +
                '                span class=color $color\n' +
                '', {
                    scopeTags: true
                }
            );

            data = {
                title: 'Crazy colors',
                listing: [{
                    color: 'lime'
                }, {
                    color: 'turquouse'
                }, {
                    color: 'purple'
                }]
            };

        });

        it.skip('Should render a view with a simple template', function() {
            var $html = view.parse(simpleTmpl, data);
            
            // try {
            //     console.log('SimpleTmpl', simpleTmpl.scopes);
            //     console.log('ScopeStore', simpleTmpl.scopeStore);
            // } catch(err) {
            //     console.log(err.message);
            // }

            expect(simpleTmpl.scopes).to.be.an('object').and.only.have.keys('scope001');
            expect(simpleTmpl.scopes.scope001).to.be.a('function');

            expect(simpleTmpl.scopeStore).to.be.an('object').and.only.have.keys('title', 'listing');

            expect(simpleTmpl.scopeStore.title).to.be.an('array').and.to.have.length(1);
            expect(simpleTmpl.scopeStore.title[0].value).to.be.an('object');
            expect(simpleTmpl.scopeStore.title[0].id).to.be(undefined);

            expect(simpleTmpl.scopeStore.listing).to.be.an('array').and.to.have.length(1);
            expect(simpleTmpl.scopeStore.listing[0].value).to.be.an('object');
            expect(simpleTmpl.scopeStore.listing[0].id).to.eql('scope001');


            expect($html.get(0).outerHTML).to.eql('<section><h1>Crazy colors</h1>'+
                '<ul class="listing">' +
                '<li><span class="color">lime</span></li>' +
                '<li><span class="color">turquouse</span></li>' +
                '<li><span class="color">purple</span></li>' +
                '</ul></section>');
        });

        it.skip('Should render a view with a regular template', function() {

            var scopes = {};
            var html = regularTmpl(data, scopes);

            var tempalteStub = sinon.stub();
            tempalteStub.returns(html);

            console.log('KEYS 1', Object.keys(scopes));

            var scope001Spy = sinon.spy(scopes, 'scope001');
            var scope002Spy = sinon.spy(scopes, 'scope002');
            // var scope003Spy = sinon.spy(scopes, 'scope003');

            var $html = view.parse(tempalteStub, data, scopes);
            
            expect(scope001Spy).to.be.calledOnce();
            expect(scope001Spy).to.be.calledWith(data.listing, data);
            expect(scope002Spy).to.be.calledThrice();
            expect(scope002Spy).to.be.calledWith(data.listing, data);
            
            console.log('KEYS', Object.keys(scopes));

            expect(regularTmpl.scopes).to.be.an('object').and.have.keys('scope001', 'scope002');
            expect(regularTmpl.scopes.scope001).to.be.a('function');

            expect(regularTmpl.scopeStore).to.be.an('object').and.have.keys('title', 'listing');

            expect(regularTmpl.scopeStore.title).to.be.an('array').and.to.have.length(1);
            expect(regularTmpl.scopeStore.title[0].value).to.be.an('object');
            expect(regularTmpl.scopeStore.title[0].id).to.be(undefined);

            expect(regularTmpl.scopeStore.listing).to.be.an('array').and.to.have.length(1);
            expect(regularTmpl.scopeStore.listing[0].value).to.be.an('object');
            expect(regularTmpl.scopeStore.listing[0].id).to.eql('scope001');


            expect($html.get(0).outerHTML).to.eql('<section><h1>Crazy colors</h1>'+
                '<ul class="listing">' +
                '<li><span class="color">lime</span></li>' +
                '<li><span class="color">turquouse</span></li>' +
                '<li><span class="color">purple</span></li>' +
                '</ul></section>');
        });
    });

    describe.skip('render and inject', function() {
        var presenter,
            template;

        beforeEach(function() {
            presenter = new XQCore.Presenter();
            template = 'div $a\n';
        });

        it('Should render and inject a view (replace)', function() {
            var data = { a: 'AA' };

            var view = new XQCore.View('test', function(self) {
                self.container = $.parseHTML('<section><section class="xq-view xq-old-view">OLD</section></section>');
                self.mode = 'replace';
                self.template = template;
            });

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql('<section class="xq-view xq-test-view"><div>AA</div></section>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><section class="xq-view xq-test-view"><div>AA</div></section></section>');
        });

        it('Should render and inject a view (append)', function() {
            var data = { a: 'AA' };

            var view = new XQCore.View('test', function(self) {
                self.container = $.parseHTML('<section><section class="xq-view xq-old-view">OLD</section></section>');
                self.mode = 'append';
                self.template = template;
            });

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql('<section class="xq-view xq-test-view"><div>AA</div></section>');
            expect(view.$ct.get(0).outerHTML).to.eql(
                '<section>' +
                '<section class="xq-view xq-old-view">OLD</section>' +
                '<section class="xq-view xq-test-view"><div>AA</div></section>' +
                '</section>'
            );
        });

        it('Should render and inject a view (prepend)', function() {
            var data = { a: 'AA' };

            var view = new XQCore.View('test', function(self) {
                self.container = $.parseHTML('<section><section class="xq-view xq-old-view">OLD</section></section>');
                self.mode = 'prepend';
                self.template = template;
            });

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql('<section class="xq-view xq-test-view"><div>AA</div></section>');
            expect(view.$ct.get(0).outerHTML).to.eql(
                '<section>' +
                '<section class="xq-view xq-test-view"><div>AA</div></section>' +
                '<section class="xq-view xq-old-view">OLD</section>' +
                '</section>'
            );
        });
    });

    describe.skip('insert', function() {
        var view,
            presenter;

        beforeEach(function() {
            view = new XQCore.View();
            view.container = document.createElement('div');
            presenter = new XQCore.Presenter();

            view.template = FireTPL.compile(
                'div class="example"\n' +
                '    h1 $title\n' +
                '    div class="description" $description\n' +
                '    :each $listing : ul class="listing"\n' +
                '        li\n' +
                '            span class="name" $name\n' +
                '            span class="image"\n' +
                '                :if $image\n' +
                '                    img src="$image\n'
            );
        });

        afterEach(function() {
        });

        it('Should insert an item', function() {
            var data = {
                title: 'Insert test',
                listing: [
                    { name: 'Andi' },
                    { name: 'Donnie' }
                ]
            };

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql(
                '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');

            view.insert('listing', 1, {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
                '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Carl</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');
        });

        it('Should insert an item on the begin', function() {
            var data = {
                title: 'Insert test',
                listing: [
                    { name: 'Andi' },
                    { name: 'Donnie' }
                ]
            };

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql(
                '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');

            view.insert('listing', 0, {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Carl</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');
        });

        it('Should insert an item after first item', function() {
            var data = {
                title: 'Insert test',
                listing: [
                    { name: 'Andi' },
                    { name: 'Donnie' }
                ]
            };

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql(
                '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');

            view.insert('listing', 1, {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Carl</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');
        });

        it('Should insert an item on the end', function() {
            var data = {
                title: 'Insert test',
                listing: [
                    { name: 'Andi' },
                    { name: 'Donnie' }
                ]
            };

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql(
                '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');

            view.insert('listing', -1, {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Carl</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');
        });

        it('Should insert an item on the begin using prepend', function() {
            var data = {
                title: 'Insert test',
                listing: [
                    { name: 'Andi' },
                    { name: 'Donnie' }
                ]
            };

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql(
                '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');

            view.prepend('listing', {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Carl</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');
        });

        it('Should insert an item on the end using append', function() {
            var data = {
                title: 'Insert test',
                listing: [
                    { name: 'Andi' },
                    { name: 'Donnie' }
                ]
            };

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql(
                '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');

            view.append('listing', {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Carl</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');
        });

        it('Should remove an item on the given index', function() {
            var data = {
                title: 'Insert test',
                listing: [
                    { name: 'Andi' },
                    { name: 'Donnie' },
                    { name: 'Barney'},
                    { name: 'Bubu'},
                    { name: 'Stummi'}
                ]
            };

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql(
                '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Barney</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Bubu</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Stummi</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');

            view.remove('listing', 0);
            view.remove('listing', 2);
            view.remove('listing', 99);
            view.remove('listing', -1);

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example xq-view xq-view-namelessview"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing" fire-scope="scope001" fire-path="listing">' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image"></span></li>' +
                '<li><span class="name">Barney</span>' +
                '<span class="image"></span></li>' +
                '</ul></div>');
        });
    });

    describe.skip('formSetup', function() {
        var view,
            model;

        beforeEach(function() {
            view = new XQCore.View();
            model = new XQCore.Model();

            model.schema = {
                title: {
                    type: 'string',
                    required: true
                }
            };
            
            view.$el = $($.parseHTML('<div><form on="submit:submit-form"><input type="text" name="title" value="test"></form></div>'));
        });

        it('Should setup a form', function() {
            var addEventStub = sinon.stub(view, 'addEvent');
            
            view.isReady = true;
            view.formSetup(model);

            expect(addEventStub).to.be.calledTwice();
            expect(addEventStub).to.be.calledWith(':input', 'blur', sinon.match.func);

            addEventStub.restore();
        });

        it('Should remove invalid class when blur event is thrown', function() {
            var removeClassStub = sinon.stub($.fn, 'removeClass');
            var addClassStub = sinon.stub($.fn, 'addClass');
            var blurStub = sinon.stub(view, 'addEvent');
            var validateOneStub = sinon.stub(model, 'validateOne');
            
            view.isReady = true;

            validateOneStub.returns({
                isValid: false
            });
            
            var input = view.$el.find('input').get(0);
            blurStub.withArgs(':input', 'blur', sinon.match.func).yieldsOn(input);
            view.formSetup(model);

            expect(removeClassStub).to.be.calledOnce();
            expect(removeClassStub).to.be.calledWith('xq-invalid');

            expect(validateOneStub).to.be.calledOnce();
            expect(validateOneStub).to.be.calledWith({
                type: 'string',
                required: true
            }, 'test');

            expect(addClassStub).to.be.calledThrice();
            expect(addClassStub).to.be.calledWith('xq-invalid');

            blurStub.restore();
            removeClassStub.restore();
            addClassStub.restore();
            validateOneStub.restore();
        });
    });

    describe.skip('onSubmit', function() {
        it('Should change form data on submiting a form', function() {
            var submitStub = sinon.stub();
            var $form = $($.parseHTML('<form on="submit"><input type="hidden" name="test" value="aa"></form>'));

            var view = new XQCore.View('test');
            view.presenter = new XQCore.Presenter();
            view.registerListener($form);
            view.onSubmit = submitStub;

            $form.trigger('submit');

            expect(submitStub).to.be.calledOnce();
            expect(submitStub).to.be.calledWith({ test: 'aa' }, $form.get(0));
        });

        it('Should return changed form data', function() {
            var view = new XQCore.View('test');
            var data = view.onSubmit({ test: 'aa' });
            expect(data).to.eql({ test: 'aa' });
        });
    });

    describe.skip('destroy', function() {
        it('Should destroy a view', function() {
            var presenter = new XQCore.Presenter();
            var view = new XQCore.View();
            var model = new XQCore.Model();

            view.container = $($.parseHTML('div'));
            view.init(presenter);

            presenter.couple({
                view: view,
                model: model
            });

            model.init();
            presenter.init();

            view.destroy();

            expect(view._events).to.eql(undefined);
            expect(model._events).to.eql({
                'state.ready': []
            });
        });
    });
});