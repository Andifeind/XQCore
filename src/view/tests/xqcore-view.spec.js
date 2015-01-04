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
        });

        it('Should render a view', function() {
            var data = { a: 'AA' };

            renderSpy = sinon.spy(view, 'render');
            injectStub = sinon.stub(view, 'inject');

            view.init(presenter);
            view.render(data);

            expect(injectStub).was.called();
            expect(renderSpy).was.called();
            expect(renderSpy).was.calledWith(data);


            renderSpy.restore();
            injectStub.restore();
        });

        it('Should re-render a view', function() {
            var data = { a: 'AA' };

            var container = document.createElement('div');
            view.container = container;
            view.template = 'div $a';
            view.init(presenter);
            view.render({});

            var ct = view.ct,
                $ct = view.$ct,
                el = view.el,
                $el = view.$el;

            expect(view.$ct.html()).to.eql('<div class="xq-view xq-view-namelessview">undefined</div>');
            expect(view.$el.html()).to.eql('undefined');

            view.render(data);

            expect(view.$ct.html()).to.eql('<div class="xq-view xq-view-namelessview">AA</div>');
            expect(view.$el.html()).to.eql('AA');

            expect(ct).to.equal(view.ct);
            expect($ct).to.equal(view.$ct);
            expect(el).not.to.equal(view.el);
            expect($el).not.to.equal(view.$el);
        });
    });

    describe('parse using scopetags', function() {
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
            
            expect(scope001Spy).was.calledOnce();
            expect(scope001Spy).was.calledWith(data.listing, data);
            expect(scope002Spy).was.calledThrice();
            expect(scope002Spy).was.calledWith(data.listing, data);
            
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
            var addEventStub = sinon.stub(view, 'addEvent');
            
            view.isReady = true;
            view.formSetup(model);

            expect(addEventStub).was.calledTwice();
            expect(addEventStub).was.calledWith(':input', 'blur', sinon.match.func);

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

            expect(removeClassStub).was.calledOnce();
            expect(removeClassStub).was.calledWith('xq-invalid');

            expect(validateOneStub).was.calledOnce();
            expect(validateOneStub).was.calledWith({
                type: 'string',
                required: true
            }, 'test');

            expect(addClassStub).was.calledThrice();
            expect(addClassStub).was.calledWith('xq-invalid');

            blurStub.restore();
            removeClassStub.restore();
            addClassStub.restore();
            validateOneStub.restore();
        });
    });

    describe('onSubmit', function() {
        it('Should change form data on submiting a form', function() {
            var submitStub = sinon.stub();
            var $form = $($.parseHTML('<form on="submit"><input type="hidden" name="test" value="aa"></form>'));

            var view = new XQCore.View('test');
            view.presenter = new XQCore.Presenter();
            view.registerListener($form);
            view.onSubmit = submitStub;

            $form.trigger('submit');

            expect(submitStub).was.calledOnce();
            expect(submitStub).was.calledWith({ test: 'aa' }, $form.get(0));
        });

        it('Should return changed form data', function() {
            var view = new XQCore.View('test');
            var data = view.onSubmit({ test: 'aa' });
            expect(data).to.eql({ test: 'aa' });
        });
    });

    describe('destroy', function() {
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