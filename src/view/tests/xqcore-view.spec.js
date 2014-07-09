/*global $:false, FireTPL:false */
describe('XQCore View', function() {
    'use strict';

    beforeEach(function() {
        
    });

    afterEach(function() {
        
    });

    describe('constructor', function() {
        it('Should initialize a view', function() {
            var view = new XQCore.View();
            expect(view).to.be.a(XQCore.View);
        });

        it('Should get a view name from first arg', function() {
            var view = new XQCore.View('Test');
            expect(view.name).to.equal('TestView');
        });

        it('Should get a presener name from conf object', function() {
            var view = new XQCore.View({
                name: 'Test'
            });

            expect(view.name).to.equal('TestView');
        });

        it('Should set a default view name', function() {
            var view = new XQCore.View();
            expect(view.name).to.equal('NamelessView');
        });

        it('Should replace a view in it\'s container', function() {
            
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

            expect(bindStub).was.calledThrice();
            expect(bindStub).was.calledWith('show');
            expect(bindStub).was.calledWith('click');
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

            expect(bindStub).was.calledOnce();
            bindStub.restore();
        });
    });

    describe.skip('parse', function() {
        var view,
            $el;

        before(function() {
            view = new XQCore.View();
            view.template = function(data,scopes) {

            var h=new FireTPL.Runtime();

            scopes=scopes||{};
                var root, parent;
                root=data;
                parent=data;
                
                scopes.scope002=function(data,parent){
                        var s='';
                        var c=data;
                        var r=h.exec('if',c,parent,root,function(data){
                                var s='';
                                s+='<img data-src="'+data.image+'">';
                                return s;

                        });
                        s+=r;
                        return s;
                                
                };
                scopes.scope001=function(data,parent){
                        var s='';
                        s+=h.exec('each',data,parent,root,function(data){
                                var s='';
                                s+='<li><span data-id="'+data.name+'" on="click:click">';
                                s+=scopes.scope002(data.image,data);
                                s+='<span class="name">'+data.name+'</span><span class="type">'+root.type+'</span></span></li>';
                                return s;

                        });
                        return s;

                };
                var s='';
                //s+='<div><h1>'+data.title+'</h1><ul>';
                s+='<div><h1><scope path="title"></scope></h1><ul>';
                //s+=scopes.scope001(data.listing,data);
                s+='<scope id="scope001" path="listing"></scope>';
                s+='</ul></div>';

            return s;

            };

            view.template = FireTPL.compile(
                'div\n' +
                '    h1 $title\n' +
                '    div\n' +
                '        :if $listing\n' +
                '            ul\n' +
                '                :each $listing\n' +
                '                    li\n' +
                '                        span data-id="$name" onClick="click"\n' +
                '                            :if $image\n' +
                '                                img data-src="$image"\n' +
                '                        span class="name"\n' +
                '                            $name\n' +
                '                        span class="type"\n' +
                '                            $parent.type\n', {
                type: 'fire',
                scopeTags: true
            });
        });


        afterEach(function() {
            
        });

        it('Should replace all scope tags with a dom fragment', function() {
            var data = {
                title: 'Parser Test',
                type: 'test',
                listing: [{
                    image: 'img3.png',
                    name: 'Take three'
                }, {
                    image: 'img4.png',
                    name: 'Take four'
                }, {
                    image: 'img5.png',
                    name: 'Take five'
                }]
            };

            var html = view.parse(view.template, data);
            // console.log('HTML', html.get(0).outerHTML);
            expect(html.get(0).outerHTML).to.eql(
                '<div><h1>Parser Test</h1><div><ul><li><span data-id=\"Take three\" on=\"click:click\">' +
                '<img data-src=\"img3.png\"></span><span class=\"name\">Take three</span>' +
                '<span class=\"type\">test</span></li><li>' +
                '<span data-id=\"Take four\" on=\"click:click\"><img data-src=\"img4.png\"></span>' +
                '<span class=\"name\">Take four</span><span class=\"type\">test</span></li><li>' +
                '<span data-id=\"Take five\" on=\"click:click\"><img data-src=\"img5.png\"></span>' +
                '<span class=\"name\">Take five</span><span class=\"type\">test</span>' +
                '</li></ul></div></div>');
            $el = html;

            expect(view.template.scopes).to.be.an('object');
            expect(view.template.scopes.scope001).to.be.a('function');
            expect(view.template.scopes.scope002).to.be.a('function');
            
            expect(view.template.scopeStore).to.be.an('object');
            
            expect(view.template.scopeStore.title).to.be.an('array');
            // expect(view.template.scopeStore.title[0]).to.be.an('object');
            // expect(view.template.scopeStore.title[0].value).to.be.an('object');
            // expect(view.template.scopeStore.title[0].id).to.be.an('undefined');

            // expect(view.template.scopeStore.listing).to.be.an('array');
            // expect(view.template.scopeStore.listing[0]).to.be.an('object');
            // expect(view.template.scopeStore.listing[0].value).to.be.an('object');
            // expect(view.template.scopeStore.listing[0].id).to.eql('scope001');
            
            // expect(view.template).to.be.a('function');
        });

        it.skip('Should change the title property', function() {
            //Change title over scopeStore
            $($.parseHTML('Changed title!')).replaceAll(view.template.scopeStore.title[0].value);
            expect($el.get(0).outerHTML).to.eql('<div><h1>Changed title!</h1><ul><li><span data-id=\"Take three\" on=\"click:click\"><img data-src=\"img3.png\"><span class=\"name\">Take three</span><span class=\"type\">test</span></span></li><li><span data-id=\"Take four\" on=\"click:click\"><img data-src=\"img4.png\"><span class=\"name\">Take four</span><span class=\"type\">test</span></span></li><li><span data-id=\"Take five\" on=\"click:click\"><img data-src=\"img5.png\"><span class=\"name\">Take five</span><span class=\"type\">test</span></span></li></ul></div>');
        });
    });

    describe('render', function() {
        var view,
            presenter,
            renderSpy,
            injectStub;

        beforeEach(function() {
            view = new XQCore.View();
            presenter = new XQCore.Presenter();

            renderSpy = sinon.spy(view, 'render');
            injectStub = sinon.stub(view, 'inject');
        });

        afterEach(function() {
            renderSpy.restore();
            injectStub.restore();
        });

        it('Should render a view', function() {
            var data = { a: 'AA' };

            view.init(presenter);
            view.render(data);

            expect(injectStub).was.called();
            expect(renderSpy).was.called();
            expect(renderSpy).was.calledWith(data);
        });
    });

    describe.only('parse using scopetags', function() {
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
            
            try {
                console.log('SimpleTmpl', simpleTmpl.scopes);
                console.log('ScopeStore', simpleTmpl.scopeStore);
            } catch(err) {
                console.log(err.message);
            }

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

        it('Should render a view with a regular template', function() {
            var $html = view.parse(regularTmpl, data);
            
            try {
                console.log('SimpleTmpl', regularTmpl.scopes);
                console.log('ScopeStore', regularTmpl.scopeStore);
            } catch(err) {
                console.log(err.message);
            }

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

    describe('render and inject', function() {
        var presenter,
            view,
            view2,
            $ct,
            template;

        beforeEach(function() {
            presenter = new XQCore.Presenter();
            view = new XQCore.View();
            view2 = new XQCore.View();
            template = 'div $a';
            $ct = $($.parseHTML('<section></section>'));
        });

        it('Should render and inject a view (replace)', function() {
            var data = { a: 'AA' };

            view.container = $ct;
            view.mode = 'replace';
            view.template = template;

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div></section>');
        });

        it('Should render and inject a view (append)', function() {
            var data = { a: 'AA' };

            view.container = $ct;
            view.mode = 'append';
            view.template = template;

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div></section>');
        });

        it('Should render and inject a view (prepend)', function() {
            var data = { a: 'AA' };

            view.container = $ct;
            view.mode = 'prepend';
            view.template = template;

            view.init(presenter);
            view.render(data);

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div></section>');
        });

        it('Should render and inject two views (replace)', function() {
            var data = { a: 'AA' },
                data2 = { a: 'BB' };

            view.container = $ct;
            view.mode = 'replace';
            view.template = template;

            view2.container = $ct;
            view2.mode = 'replace';
            view2.template = template;

            view.init(presenter);
            view2.init(presenter);

            view.render(data);
            view2.render(data2);

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view2.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">BB</div>');
            
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">BB</div></section>');
        });

        it('Should render and inject two views (append)', function() {
            var data = { a: 'AA' },
                data2 = { a: 'BB' };

            view.container = $ct;
            view.mode = 'append';
            view.template = template;

            view2.container = $ct;
            view2.mode = 'append';
            view2.template = template;

            view.init(presenter);
            view2.init(presenter);

            view.render(data);
            view2.render(data2);

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view2.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">BB</div>');
            
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div><div class="xq-view xq-view-namelessview">BB</div></section>');
        });

        it('Should render and inject two views (prepend)', function() {
            var data = { a: 'AA' },
                data2 = { a: 'BB' };

            view.container = $ct;
            view.mode = 'prepend';
            view.template = template;

            view2.container = $ct;
            view2.mode = 'prepend';
            view2.template = template;

            view.init(presenter);
            view2.init(presenter);

            view.render(data);
            view2.render(data2);

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view2.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">BB</div>');
            
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">BB</div><div class="xq-view xq-view-namelessview">AA</div></section>');
        });

        it('Should render and inject two views using .inject() (replace)', function() {
            var data = { a: 'AA' },
                data2 = { a: 'BB' };

            view.container = $ct;
            view.mode = 'replace';
            view.template = template;
            view.autoInject = false;

            view2.container = $ct;
            view2.mode = 'replace';
            view2.template = template;

            view.init(presenter);
            view2.init(presenter);
            
            view.render(data);
            view2.render(data2);

            expect(view.$el.get(0).outerHTML).to.eql('<div>AA</div>');
            expect(view2.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">BB</div>');
            
            expect(view2.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">BB</div></section>');
        });

        it('Should render and inject two views using .inject() (append)', function() {
            var data = { a: 'AA' },
                data2 = { a: 'BB' };

            view.container = $ct;
            view.mode = 'append';
            view.template = template;
            view.autoInject = false;

            view2.container = $ct;
            view2.mode = 'append';
            view2.template = template;

            view.init(presenter);
            view2.init(presenter);

            view.render(data);
            view2.render(data2);

            expect(view.$el.get(0).outerHTML).to.eql('<div>AA</div>');
            expect(view2.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">BB</div>');
            
            expect(view2.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">BB</div></section>');
        });

        it('Should render and inject two views using .inject() (prepend)', function() {
            var data = { a: 'AA' },
                data2 = { a: 'BB' };

            view.container = $ct;
            view.mode = 'prepend';
            view.template = template;
            view.autoInject = false;

            view2.container = $ct;
            view2.mode = 'prepend';
            view2.template = template;

            view.init(presenter);
            view2.init(presenter);

            view.render(data);
            view2.render(data2);

            expect(view.$el.get(0).outerHTML).to.eql('<div>AA</div>');
            expect(view2.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">BB</div>');
            
            expect(view2.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">BB</div></section>');
        });

        it('Should never inject a view twice (replace)', function() {
            var data = { a: 'AA' };

            var injectSpy = sinon.spy(view, 'inject');
            

            view.container = $ct;
            view.mode = 'replace';
            view.template = template;

            view.init(presenter);
            view.render(data);
            view.inject();

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div></section>');
            
            expect(injectSpy).was.calledTwice();
            injectSpy.restore();
        });

        it('Should never inject a view twice (append)', function() {
            var data = { a: 'AA' };

            var injectSpy = sinon.spy(view, 'inject');
            

            view.container = $ct;
            view.mode = 'append';
            view.template = template;

            view.init(presenter);
            view.render(data);
            view.inject();

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div></section>');
            
            expect(injectSpy).was.calledTwice();
            injectSpy.restore();
        });

        it('Should never inject a view twice (prepend)', function() {
            var data = { a: 'AA' };

            var injectSpy = sinon.spy(view, 'inject');
            

            view.container = $ct;
            view.mode = 'prepend';
            view.template = template;

            view.init(presenter);
            view.render(data);
            view.inject();

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div></section>');
            
            expect(injectSpy).was.calledTwice();
            injectSpy.restore();
        });

        it('Should never inject a view twice, autoInject is disabled (replace)', function() {
            var data = { a: 'AA' };

            var injectSpy = sinon.spy(view, 'inject');
            

            view.container = $ct;
            view.mode = 'replace';
            view.template = template;
            view.autoInject = false;

            view.init(presenter);
            view.render(data);
            view.inject();
            view.inject();

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div></section>');
            
            expect(injectSpy).was.calledTwice();
            injectSpy.restore();
        });

        it('Should never inject a view twice, autoInject is disabled (append)', function() {
            var data = { a: 'AA' };

            var injectSpy = sinon.spy(view, 'inject');
            

            view.container = $ct;
            view.mode = 'append';
            view.template = template;
            view.autoInject = false;

            view.init(presenter);
            view.render(data);
            view.inject();
            view.inject();

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div></section>');
            
            expect(injectSpy).was.calledTwice();
            injectSpy.restore();
        });

        it('Should never inject a view twice, autoInject is disabled (prepend)', function() {
            var data = { a: 'AA' };

            var injectSpy = sinon.spy(view, 'inject');
            

            view.container = $ct;
            view.mode = 'prepend';
            view.template = template;
            view.autoInject = false;

            view.init(presenter);
            view.render(data);
            view.inject();
            view.inject();

            expect(view.$el.get(0).outerHTML).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$ct.get(0).outerHTML).to.eql('<section><div class="xq-view xq-view-namelessview">AA</div></section>');
            
            expect(injectSpy).was.calledTwice();
            injectSpy.restore();
        });
    });

    describe('insert', function() {
        var view,
            presenter;

        beforeEach(function() {
            view = new XQCore.View();
            presenter = new XQCore.Presenter();

            view.template = FireTPL.compile(
                'div class="example"\n' +
                '    h1 $title\n' +
                '    div class="description" $description\n' +
                '    ul class="listing\n' +
                '        :each $listing\n' +
                '            li\n' +
                '                span class="name" $name\n' +
                '                span class="image"\n' +
                '                    :if $image\n' +
                '                        img src="$image\n'
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
                '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '</ul></div>');

            view.insert('listing', 0, {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Carl</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
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
                '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '</ul></div>');

            view.insert('listing', 1, {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Carl</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
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
                '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '</ul></div>');

            view.insert('listing', -1, {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Carl</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
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
                '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '</ul></div>');

            view.prepend('listing', {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Carl</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
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
                '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '</ul></div>');

            view.append('listing', {name: 'Carl'});

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Carl</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
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
                '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Andi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Barney</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Bubu</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Stummi</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '</ul></div>');

            view.remove('listing', 0);
            view.remove('listing', 2);
            view.remove('listing', 99);
            view.remove('listing', -1);

            expect(view.$el.get(0).outerHTML).to.eql(
            '<div class="example"><h1>Insert test</h1>' +
                '<div class="description">undefined</div>' +
                '<ul class="listing xq-scope xq-scope001" xq-scope="scope001" xq-path="listing">' +
                '<li><span class="name">Donnie</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '<li><span class="name">Barney</span>' +
                '<span class="image xq-scope xq-scope002" xq-scope="scope002" xq-path="image"></span></li>' +
                '</ul></div>');
        });
    });

    describe('ready', function() {
        it('Should call functions if state is ready', function() {
            var fn = sinon.stub();
            var view = new XQCore.View('test');

            view.isReady = false;
            view.ready(fn);
            expect(fn).was.notCalled();

            //Set ready state
            view.__setReadyState();
            expect(fn).was.calledOnce();
            expect(view.__setReadyState).to.have.length(0);
        });

        it('Should call functions immediately because state is ready', function() {
            var fn = sinon.stub();
            var view = new XQCore.View('test');

            view.isReady = false;
            view.ready(fn);
            expect(fn).was.notCalled();

            //Set ready state
            view.__setReadyState();
            expect(fn).was.calledOnce();
            expect(view.__setReadyState).to.have.length(0);
        });
    });

    describe('formSetup', function() {
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
            var blurStub = sinon.stub($.fn, 'blur');
            
            view.formSetup(model);

            expect(blurStub).was.calledOnce();
            expect(blurStub).was.calledWith(sinon.match.func);

            blurStub.restore();
        });

        it('Should remove invalid class when blur event is thrown', function() {
            var removeClassStub = sinon.stub($.fn, 'removeClass');
            var addClassStub = sinon.stub($.fn, 'addClass');
            var blurStub = sinon.stub($.fn, 'blur');
            var validateOneStub = sinon.stub(model, 'validateOne');
            
            validateOneStub.returns({
                isValid: false
            });
            
            view.formSetup(model);
            blurStub.yield();

            expect(removeClassStub).was.calledOnce();
            expect(removeClassStub).was.calledWith('xq-invalid');

            expect(validateOneStub).was.calledOnce();
            expect(validateOneStub).was.calledWith({
                type: 'string',
                required: true
            }, 'test');

            expect(addClassStub).was.calledTrice();
            expect(addClassStub).was.calledWith('xq-invalid');

            blurStub.restore();
            removeClassStub.restore();
            addClassStub.restore();
            validateOneStub.restore();
        });
    });

    xit('Should register view events at presenter', function() {
        var view,
            presenter,
            testSpy1 = sinon.spy(),
            testSpy2 = sinon.spy();

        presenter = new XQCore.Presenter({
            events: {
                'test1': testSpy1,
                'test2': testSpy2
            }
        });

        view = new XQCore.View({
            debug: false,
            name: 'test1',
            // container: viewContainer,
            events: {
                'mousedown #test': 'test1',
                'mouseup #test': 'test2'
            }
        });

        presenter.registerView(view);
        presenter.init();

        expect(view).to.be.an('object');
        expect(presenter).to.be.an('object');

        // viewContainer.find('#test').trigger('mousedown');
        // viewContainer.find('#test').trigger('mouseup');
        expect(testSpy1).was.called();
        expect(testSpy2).was.called();
    });

    xit('Should initialize a view and call presenter.viewInit', function() {
        var presenter,
            view,
            initFunc = sinon.spy();

        presenter = new XQCore.Presenter({
            'viewInit': initFunc
        });

        view = new XQCore.View(presenter, {
            // container: viewContainer
        });

        presenter.init(view);

        expect(view).to.be.an('object');
        expect(initFunc).was.called();
    });

    xit('Should render a view triggered by presenter.viewInit()', function() {
        var testPresenter,
            testView;

        testPresenter = new XQCore.Presenter({
            'viewInit': function(view) {
                if (view.name === 'testView') {
                    view.render({
                        listing:[
                            {text: 'aaa'},
                            {text: 'bbb'},
                            {text: 'ccc'},
                            {text: 'ddd'},
                            {text: 'eee'}
                        ]
                    });
                }
            }
        });

        testView = new XQCore.View(testPresenter, {
            //jshint multistr:true
            name: 'test',
            // container: viewContainer,
            template: '<ul>\
                {{#each listing}}\
                <li>{{text}}</li>\
                {{/each}}\
                </ul>'
        });

        testPresenter.init(testView);

        expect(testView).to.be.an('object');
        // $expect(viewContainer).to.have('ul > li');
    });

    xit('Should forget to set the subSelector and should log an error to the console', function() {
        var presenter = new XQCore.Presenter({
        });

        var view = new XQCore.View(presenter, {
            debug: true,
            // container: viewContainer
        });

        var log = sinon.spy(view, 'warn');

        view.append({
            test: 'aaa'
        });


        expect(log).was.called();
        expect(log).was.calledWith('You must set the subSelector option');
    });

    xit('Should forget to set the itemTemplate and should log an error to the console', function() {
        var presenter = new XQCore.Presenter({
        });

        var view = new XQCore.View(presenter, {
            debug: true,
            // container: viewContainer,
            subSelector: '#test'
        });

        var log = sinon.spy(view, 'warn');

        view.append({
            test: 'aaa'
        });


        expect(log).was.called();
        expect(log).was.calledWith('You must set the itemTemplate option');
    });

    xit('Should add a html fragment to an existing html node', function() {
        var presenter = new XQCore.Presenter({
        });

        var view = new XQCore.View(presenter, {
            debug: true,
            // container: viewContainer,
            subSelector: '#test',
            itemTemplate: '<span>{{name}}</span>'
        });

        var log = sinon.spy(view, 'warn');
        
        view.append({
            name: 'aaa'
        });
        
        view.append({
            name: 'bbb'
        });
        
        view.append({
            name: 'ccc'
        });
        
        view.append({
            name: 'ddd'
        });
        
        view.append({
            name: 'eee'
        });


        expect(log).was.notCalled();
        $expect('#test > span').to.exist();
        $expect('#test > span:eq(0)').to.contain('aaa');
        $expect('#test > span:eq(1)').to.contain('bbb');
        $expect('#test > span:eq(2)').to.contain('ccc');
        $expect('#test > span:eq(3)').to.contain('ddd');
        $expect('#test > span:eq(4)').to.contain('eee');
    });

    xit('Should prepend a html fragment to an existing html node', function() {
        var presenter = new XQCore.Presenter({
        });

        var view = new XQCore.View(presenter, {
            debug: true,
            // container: viewContainer,
            subSelector: '#test',
            itemTemplate: '<span>{{name}}</span>'
        });

        var log = sinon.spy(view, 'warn');
        
        view.prepend({
            name: 'aaa'
        });
        
        view.prepend({
            name: 'bbb'
        });
        
        view.prepend({
            name: 'ccc'
        });
        
        view.prepend({
            name: 'ddd'
        });
        
        view.prepend({
            name: 'eee'
        });


        expect(log).was.notCalled();
        $expect('#test > span').to.exist();
        $expect('#test > span:eq(0)').to.contain('eee');
        $expect('#test > span:eq(1)').to.contain('ddd');
        $expect('#test > span:eq(2)').to.contain('ccc');
        $expect('#test > span:eq(3)').to.contain('bbb');
        $expect('#test > span:eq(4)').to.contain('aaa');
    });

    xit('Should gets the data of an element', function() {
        //jshint multistr:true
        $('#test').html('<ul>\
            <li data-id="123" data-bla="blub">Example</li>\
            <li data-id="124" data-bla="blub blub">Example II</li>\
            <li data-id="125" data-bla="blubber blub">Example III</li>\
        </ul>');

        var presenter = new XQCore.Presenter({
        });

        var view = new XQCore.View(presenter, {
            // container: viewContainer
        });

        expect(view.getElementData('#test li:eq(0)')).to.eql({
            id: '123',
            bla: 'blub'
        });

        expect(view.getElementData(document.getElementById('test').getElementsByTagName('li')[1])).to.eql({
            id: '124',
            bla: 'blub blub'
        });

        expect(view.getElementData('#dont-exists')).to.be(null);
        expect(view.getElementData(undefined)).to.be(null);
        expect(view.getElementData(null)).to.be(null);


    });

    xit('Should gets the data of an element and should convert its datatypes correctly', function() {
        $('#test').html('<ul>' +
            '<li data-id="121" data-bla="true">Example</li>' +
            '<li data-id="122" data-bla="false">Example II</li>' +
            '<li data-id="123" data-bla="null">Example III</li>' +
            '<li data-id="124" data-bla="undefined">Example IV</li>' +
            '<li data-id="125" data-bla="123">Example V</li>' +
            '<li data-id="126" data-bla="-123">Example VI</li>' +
            '<li data-id="127" data-bla="{&quot;a&quot;:&quot;b&quot;}">Example III</li>' +
        '</ul>');

        var presenter = new XQCore.Presenter({
        });

        var view = new XQCore.View(presenter, {
            // container: viewContainer
        });

        expect(view.getElementData('#test li:eq(0)')).to.eql({
            id: '121',
            bla: true
        });

        expect(view.getElementData('#test li:eq(1)')).to.eql({
            id: '122',
            bla: false
        });

        expect(view.getElementData('#test li:eq(2)')).to.eql({
            id: '123',
            bla: null
        });

        expect(view.getElementData('#test li:eq(3)')).to.eql({
            id: '124',
            bla: undefined
        });

        expect(view.getElementData('#test li:eq(4)')).to.eql({
            id: '125',
            bla: 123
        });

        expect(view.getElementData('#test li:eq(5)')).to.eql({
            id: '126',
            bla: -123
        });

        expect(view.getElementData('#test li:eq(6)')).to.eql({
            id: '127',
            bla: {
                a: 'b'
            }
        });

    });

    xit('Should call a validationVailed function in a coupled view', function() {
        var validationCb = sinon.spy();
        
        var presenter = new XQCore.Presenter();
        var model = new XQCore.Model({
            name: { type: 'Object' }
        });
        var view = new XQCore.View({
            validationVailed: validationCb
        });

        presenter.couple({
            model: model,
            view: view
        });

        model.set({
            name: 'DrTest'
        });

        expect(validationCb).was.called();
        expect(validationCb).was.calledWith({
            errCode: 110,
            msg:''
        });

    });



});