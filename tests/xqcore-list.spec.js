describe.skip('XQCore List', function() {
    'use strict';

    describe('instance', function() {
        beforeEach(function() {

        });

        afterEach(function() {

        });

        it('Should be a function', function() {
            console.log('XQC', XQCore);
            expect(XQCore.List).to.be.a('function');
        });

        it('Should be an instance of XQCore.List', function() {
            var list = new XQCore.List();
            expect(list).to.be.an(XQCore.List);
        });

        it('Should create an instance, using conf object', function() {
            var list = new XQCore.List('test1', {
                myconf: '123'
            });

            expect(list.name).to.eql('test1List');
            expect(list.myconf).to.eql('123');
        });

        it('Should create an instance, using conf function', function() {
            var list = new XQCore.List('test1', function(self) {
                self.myconf =  '123';
            });

            expect(list.name).to.eql('test1List');
            expect(list.myconf).to.eql('123');
        });
    });

    describe('model', function() {
        it('Should point to a model prototype.', function() {
            var list = new XQCore.List();
            expect(list.model).to.be(XQCore.Model);
        });
    });

    describe('items', function() {
        it('Should have an items array', function() {
            var list = new XQCore.List();
            expect(list.items).to.be.an('array');
            expect(list.items.length).to.eql(0);


        });
    });

    describe('length', function() {
        it('Should contains the amount of items', function() {
            var list = new XQCore.List();
            expect(list.length).to.be.a('number');
            expect(list.length).to.eql(0);

            list.items.push('1', '2');
            expect(list.length).to.eql(2);
        });
    });

    describe('state', function() {
        it('Should have a ready state', function() {
            var list = new XQCore.List();
            expect(list.__state).to.eql('ready');
        });

        it('Should set a state', function() {
            var list = new XQCore.List();

            list.state('loading');
            expect(list.__state).to.eql('loading');

        });

        it('Should emit a state.change event', function() {
            var cb = sinon.stub();
            var list = new XQCore.List();

            list.on('state.change', cb);
            list.state('loading');
            expect(cb).to.be.calledOnce();
            expect(cb).to.be.calledWith('loading');
        });

        it('Should emit a state.<state> event', function() {
            var cb = sinon.stub();
            var list = new XQCore.List();

            list.on('state.loading', cb);
            list.state('loading');
            expect(cb).to.be.calledOnce();
            expect(cb).to.be.calledWith();
        });
    });

    describe('getState', function() {
        it('Should get the current state', function() {
            var list = new XQCore.List();

            expect(list.getState()).to.eql('ready');
            list.__state = 'loading';
            expect(list.getState()).to.eql('loading');
        });
    });

    describe('push', function() {
        it('Should add one item to the end of the list', function() {
            var list = new XQCore.List();
            var state = list.push({
                a: 'AA',
                b: 'BB'
            });

            expect(state).to.be.ok();
            expect(list.items).to.have.length(1);
            expect(list.items[0]).to.be.a(XQCore.Model);
            expect(list.items[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should not add an item if model validation fails', function() {
            var list = new XQCore.List();
            var Model = XQCore.Model.inherit('TestModel', {
                validation: {
                    key: { type: 'number', required: true }
                }
            });

            list.model = Model;

            var state = list.push({
                a: 'AA',
                b: 'BB'
            });

            expect(state).to.be.ok();
            expect(list.items).to.have.length(1);
            expect(list.items[0]).to.be.a(XQCore.Model);
            expect(list.items[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should add three items to the end of the list', function() {
            var list = new XQCore.List();
            var state = list.push([{
                a: 'AA',
                b: 'BB'
            }, {
                a: 'CC',
                b: 'DD'
            }, {
                a: 'EE',
                b: 'FF'
            }]);

            expect(state).to.be.ok();
            expect(list.items).to.have.length(3);
            expect(list.items[0]).to.be.a(XQCore.Model);
            expect(list.items[1]).to.be.a(XQCore.Model);
            expect(list.items[2]).to.be.a(XQCore.Model);
            expect(list.items[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });

            expect(list.items[1].properties).to.eql({
                a: 'CC',
                b: 'DD'
            });

            expect(list.items[2].properties).to.eql({
                a: 'EE',
                b: 'FF'
            });
        });

        it('Should add one item of type model to the end of the list', function() {
            var list = new XQCore.List();
            var model = new XQCore.Model();
            model.set({
                a: 'AA',
                b: 'BB'
            });

            var state = list.push(model);

            expect(state).to.be.ok();
            expect(list.items).to.have.length(1);
            expect(list.items[0]).to.be.a(XQCore.Model);
            expect(list.items[0]).to.be.equal(model);
            expect(list.items[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should add three items of type model to the end of the list', function() {
            var list = new XQCore.List();
            var model1 = new XQCore.Model();
            model1.set({
                a: 'AA',
                b: 'BB'
            });

            var model2 = new XQCore.Model();
            model2.set({
                a: 'CC',
                b: 'DD'
            });

            var model3 = new XQCore.Model();
            model3.set({
                a: 'EE',
                b: 'FF'
            });

            var state = list.push([model1, model2, model3]);

            expect(state).to.be.ok();
            expect(list.items).to.have.length(3);
            expect(list.items[0]).to.be.a(XQCore.Model);
            expect(list.items[1]).to.be.a(XQCore.Model);
            expect(list.items[2]).to.be.a(XQCore.Model);
            expect(list.items[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });

            expect(list.items[1].properties).to.eql({
                a: 'CC',
                b: 'DD'
            });

            expect(list.items[2].properties).to.eql({
                a: 'EE',
                b: 'FF'
            });
        });

        it('Should emit an item.push event', function() {
            var list = new XQCore.List();
            var cb = sinon.stub();

            list.on('item.push', cb);

            list.push({
                a: 'AA',
                b: 'BB'
            });

            expect(list.items).to.have.length(1);
            expect(cb).to.be.calledOnce();
            expect(cb).to.be.calledWith(sinon.match.array, 1);
        });

        it('Should emit an item.push event on adding multiple items', function() {
            var list = new XQCore.List();
            var cb = sinon.stub();

            list.on('item.push', cb);

            list.push([{
                a: 'AA',
                b: 'BB'
            }, {
                a: 'CC',
                b: 'DD'
            }, {
                a: 'EE',
                b: 'FF'
            }]);

            expect(list.items).to.have.length(3);
            expect(cb).to.be.calledOnce();
            expect(cb).to.be.calledWith(sinon.match.array, 3);
        });

        it('Should not emit an item.push event if silent option is set', function() {
            var list = new XQCore.List();
            var cb = sinon.stub();

            list.on('item.push', cb);

            list.push({
                a: 'AA',
                b: 'BB'
            }, { silent: true });

            expect(cb).to.be.notCalled();
        });

        it('Should call sync method', function() {
            var list = new XQCore.List();
            list.sync = sinon.stub();

            list.push({
                a: 'AA',
                b: 'BB'
            });

            expect(list.items).to.have.length(1);
            expect(list.sync).to.be.calledOnce();
            expect(list.sync).to.be.calledWith('push', sinon.match.array);
            var models = list.sync.firstCall.args[1];
            expect(models).to.be.an('array');
            expect(models[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should call sync method', function() {
            var list = new XQCore.List();
            list.sync = sinon.stub();

            list.push([{
                a: 'AA',
                b: 'BB'
            }, {
                a: 'CC',
                b: 'DD'
            }, {
                a: 'EE',
                b: 'FF'
            }]);

            expect(list.items).to.have.length(3);
            expect(list.sync).to.be.calledOnce();
            expect(list.sync).to.be.calledWith('push', sinon.match.array);
            var models = list.sync.firstCall.args[1];
            expect(models).to.be.an('array');
            expect(models[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });

            expect(models[1].properties).to.eql({
                a: 'CC',
                b: 'DD'
            });

            expect(models[2].properties).to.eql({
                a: 'EE',
                b: 'FF'
            });
        });

        it('Should not call sync method if noSync option is set', function() {
            var list = new XQCore.List();
            list.sync = sinon.stub();

            list.push({
                a: 'AA',
                b: 'BB'
            }, { noSync: true });

            expect(list.sync).to.be.notCalled();
        });
    });



    describe('unshift', function() {
        it('Should add one item to the beginning of the list', function() {
            var list = new XQCore.List();
            var state = list.unshift({
                a: 'AA',
                b: 'BB'
            });

            expect(state).to.be.ok();
            expect(list.items).to.have.length(1);
            expect(list.items[0]).to.be.a(XQCore.Model);
            expect(list.items[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should add three items to the beginning of the list', function() {
            var list = new XQCore.List();
            var state = list.unshift([{
                a: 'AA',
                b: 'BB'
            }, {
                a: 'CC',
                b: 'DD'
            }, {
                a: 'EE',
                b: 'FF'
            }]);

            expect(state).to.be.ok();
            expect(list.items).to.have.length(3);
            expect(list.items[0]).to.be.a(XQCore.Model);
            expect(list.items[1]).to.be.a(XQCore.Model);
            expect(list.items[2]).to.be.a(XQCore.Model);
            expect(list.items[0].properties).to.eql({
                a: 'EE',
                b: 'FF'
            });

            expect(list.items[1].properties).to.eql({
                a: 'CC',
                b: 'DD'
            });

            expect(list.items[2].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should add one item of type model to the beginning of the list', function() {
            var list = new XQCore.List();
            var model = new XQCore.Model();
            model.set({
                a: 'AA',
                b: 'BB'
            });

            var state = list.unshift(model);

            expect(state).to.be.ok();
            expect(list.items).to.have.length(1);
            expect(list.items[0]).to.be.a(XQCore.Model);
            expect(list.items[0]).to.be.equal(model);
            expect(list.items[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should add three items of type model to the beginning of the list', function() {
            var list = new XQCore.List();
            var model1 = new XQCore.Model();
            model1.set({
                a: 'AA',
                b: 'BB'
            });

            var model2 = new XQCore.Model();
            model2.set({
                a: 'CC',
                b: 'DD'
            });

            var model3 = new XQCore.Model();
            model3.set({
                a: 'EE',
                b: 'FF'
            });

            var state = list.unshift([model1, model2, model3]);

            expect(state).to.be.ok();
            expect(list.items).to.have.length(3);
            expect(list.items[0]).to.be.a(XQCore.Model);
            expect(list.items[1]).to.be.a(XQCore.Model);
            expect(list.items[2]).to.be.a(XQCore.Model);
            expect(list.items[0].properties).to.eql({
                a: 'EE',
                b: 'FF'
            });

            expect(list.items[1].properties).to.eql({
                a: 'CC',
                b: 'DD'
            });

            expect(list.items[2].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should emit an item.unshift event', function() {
            var list = new XQCore.List();
            var cb = sinon.stub();

            list.on('item.unshift', cb);

            list.unshift({
                a: 'AA',
                b: 'BB'
            });

            expect(list.items).to.have.length(1);
            expect(cb).to.be.calledOnce();
            expect(cb).to.be.calledWith(sinon.match.array, 1);
        });

        it('Should emit an item.unshift event on adding multiple items', function() {
            var list = new XQCore.List();
            var cb = sinon.stub();

            list.on('item.unshift', cb);

            list.unshift([{
                a: 'EE',
                b: 'FF'
            }, {
                a: 'CC',
                b: 'DD'
            }, {
                a: 'AA',
                b: 'BB'
            }]);

            expect(list.items).to.have.length(3);
            expect(cb).to.be.calledOnce();
            expect(cb).to.be.calledWith(sinon.match.array, 3);
        });

        it('Should not emit an item.unshift event if silent option is set', function() {
            var list = new XQCore.List();
            var cb = sinon.stub();

            list.on('item.unshift', cb);

            list.unshift({
                a: 'AA',
                b: 'BB'
            }, { silent: true });

            expect(cb).to.be.notCalled();
        });

        it('Should call sync method', function() {
            var list = new XQCore.List();
            list.sync = sinon.stub();

            list.unshift({
                a: 'AA',
                b: 'BB'
            });

            expect(list.items).to.have.length(1);
            expect(list.sync).to.be.calledOnce();
            expect(list.sync).to.be.calledWith('unshift', sinon.match.array);
            var models = list.sync.firstCall.args[1];
            expect(models).to.be.an('array');
            expect(models[0].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should call sync method', function() {
            var list = new XQCore.List();
            list.sync = sinon.stub();

            list.unshift([{
                a: 'AA',
                b: 'BB'
            }, {
                a: 'CC',
                b: 'DD'
            }, {
                a: 'EE',
                b: 'FF'
            }]);

            expect(list.items).to.have.length(3);
            expect(list.sync).to.be.calledOnce();
            expect(list.sync).to.be.calledWith('unshift', sinon.match.array);
            var models = list.sync.firstCall.args[1];
            expect(models).to.be.an('array');
            expect(models[0].properties).to.eql({
                a: 'EE',
                b: 'FF'
            });

            expect(models[1].properties).to.eql({
                a: 'CC',
                b: 'DD'
            });

            expect(models[2].properties).to.eql({
                a: 'AA',
                b: 'BB'
            });
        });

        it('Should not call sync method if noSync option is set', function() {
            var list = new XQCore.List();
            list.sync = sinon.stub();

            list.unshift({
                a: 'AA',
                b: 'BB'
            }, { noSync: true });

            expect(list.sync).to.be.notCalled();
        });
    });

    describe('pop', function() {
        var list, model1, model2, model3;

        beforeEach(function() {
            list = new XQCore.List();
            model1 = new XQCore.Model();
            model1.set({
                a: 'AA',
                b: 'BB'
            });

            model2 = new XQCore.Model();
            model2.set({
                a: 'CC',
                b: 'DD'
            });

            model3 = new XQCore.Model();
            model3.set({
                a: 'EE',
                b: 'FF'
            });

            list.push([model1, model2, model3]);
        });

        it('Should remove the last item of the list', function() {
            var removed = list.pop();

            expect(removed).to.be.a('object');
            expect(removed).to.be.equal(model3);
            expect(list.items).to.have.length(2);
        });

        it('Should remove the last item of the list, returns null if list was empty', function() {
            var removed = list.pop();
            removed = list.pop();
            removed = list.pop();

            expect(removed).to.be.a('object');
            expect(removed).to.be.equal(model1);
            expect(list.items).to.have.length(0);

            removed = list.pop();
            expect(removed).to.be.equal(null);
            expect(list.items).to.have.length(0);
        });

        it('Should emit an item.pop event', function() {
            var cb = sinon.stub();

            list.on('item.pop', cb);
            list.pop();

            expect(cb).to.be.calledOnce();
            expect(cb).to.be.calledWith(model3);
        });

        it('Should not emit an item.pop event if silent option is set', function() {
            var cb = sinon.stub();

            list.on('item.pop', cb);
            list.pop({ silent: true });

            expect(cb).to.be.notCalled();
        });

        it('Should call sync method', function() {
            list.sync = sinon.stub();
            list.pop();

            expect(list.sync).to.be.calledOnce();
            expect(list.sync).to.be.calledWith('pop', model3);
        });

        it('Should not call sync method if noSync option is set', function() {
            list.sync = sinon.stub();
            list.pop( { noSync: true });

            expect(list.sync).to.be.notCalled();
        });
    });

    describe('shift', function() {
        var list, model1, model2, model3;

        beforeEach(function() {
            list = new XQCore.List();
            model1 = new XQCore.Model();
            model1.set({
                a: 'AA',
                b: 'BB'
            });

            model2 = new XQCore.Model();
            model2.set({
                a: 'CC',
                b: 'DD'
            });

            model3 = new XQCore.Model();
            model3.set({
                a: 'EE',
                b: 'FF'
            });

            list.push([model1, model2, model3]);
        });

        it('Should remove the first item of the list', function() {
            var removed = list.shift();

            expect(removed).to.be.a('object');
            expect(removed).to.be.equal(model1);
            expect(list.items).to.have.length(2);
        });

        it('Should remove the first item of the list, returns null if list was empty', function() {
            var removed = list.shift();
            removed = list.shift();
            removed = list.shift();

            expect(removed).to.be.a('object');
            expect(removed).to.be.equal(model3);
            expect(list.items).to.have.length(0);

            removed = list.shift();
            expect(removed).to.be.equal(null);
            expect(list.items).to.have.length(0);
        });

        it('Should emit an item.shift event', function() {
            var cb = sinon.stub();

            list.on('item.shift', cb);
            list.shift();

            expect(cb).to.be.calledOnce();
            expect(cb).to.be.calledWith(model1);
        });

        it('Should not emit an item.shift event if silent option is set', function() {
            var cb = sinon.stub();

            list.on('item.shift', cb);
            list.shift({ silent: true });

            expect(cb).to.be.notCalled();
        });

        it('Should call sync method', function() {
            list.sync = sinon.stub();
            list.shift();

            expect(list.sync).to.be.calledOnce();
            expect(list.sync).to.be.calledWith('shift', model1);
        });

        it('Should not call sync method if noSync option is set', function() {
            list.sync = sinon.stub();
            list.shift( { noSync: true });

            expect(list.sync).to.be.notCalled();
        });
    });

    describe('findOne', function() {
        var list, model1, model2, model3;

        beforeEach(function() {
            list = new XQCore.List();
            model1 = new XQCore.Model();
            model1.set({
                a: 'AA',
                b: 'BB'
            });

            model2 = new XQCore.Model();
            model2.set({
                a: 'CC',
                b: 'DD'
            });

            model3 = new XQCore.Model();
            model3.set({
                a: 'EE',
                b: 'FF'
            });

            list.push([model1, model2, model3]);
        });

        it('Should search for an item', function() {
            var res = list.findOne({
                a: 'CC'
            });

            expect(res).to.eql(model2);
        });

        it('Shouldn\'t search any item', function() {
            var res = list.findOne({
                a: 'GG'
            });

            expect(res).to.eql(null);
        });
    });

    describe('find', function() {
        var list, model1, model2, model3;

        beforeEach(function() {
            list = new XQCore.List();
            model1 = new XQCore.Model();
            model1.set({
                a: 'AA',
                b: 'BB',
                c: 'XX'
            });

            model2 = new XQCore.Model();
            model2.set({
                a: 'CC',
                b: 'DD',
                c: 'YY'
            });

            model3 = new XQCore.Model();
            model3.set({
                a: 'EE',
                b: 'FF',
                c: 'XX'
            });

            list.push([model1, model2, model3]);
        });

        it('Should search for items', function() {
            var res = list.find({
                c: 'XX'
            });

            expect(res).to.eql([model1, model3]);
        });

        it('Shouldn\'t search any items', function() {
            var res = list.find({
                c: 'WW'
            });

            expect(res).to.eql([]);
        });
    });

    describe('update', function() {
        var list, model1, model2, model3;

        beforeEach(function() {
            list = new XQCore.List();
            model1 = new XQCore.Model();
            model1.set({
                id: 1,
                a: 'AA',
                b: 'BB'
            });

            model2 = new XQCore.Model();
            model2.set({
                id: 2,
                a: 'CC',
                b: 'DD'
            });

            model3 = new XQCore.Model();
            model3.set({
                id: 3,
                a: 'EE',
                b: 'FF'
            });

            list.push([model1, model2, model3]);
        });

        it('Should update an existing item', function() {
            list.update({
                id: 2
            }, {
                id: 2,
                a: 'GG',
                b: 'HH'
            });

            expect(model2.properties).to.eql({
                id: 2,
                a: 'GG',
                b: 'HH'
            });
        });

        it.skip('Should update an not existing item', function() {
            list.update({
                id: 4
            }, {
                id: 4,
                a: 'GG',
                b: 'HH'
            });

            expect(list.items[3].properties).to.eql({
                id: 4,
                a: 'GG',
                b: 'HH'
            });
        });
    });

    describe('each', function() {
        var list, model1, model2, model3;

        beforeEach(function() {
            list = new XQCore.List();
            model1 = new XQCore.Model();
            model1.set({
                id: 1,
                a: 'AA',
                b: 'BB'
            });

            model2 = new XQCore.Model();
            model2.set({
                id: 2,
                a: 'CC',
                b: 'DD'
            });

            model3 = new XQCore.Model();
            model3.set({
                id: 3,
                a: 'EE',
                b: 'FF'
            });

            list.push([model1, model2, model3]);
        });

        it('Should execute a callback on each item of the list', function() {
            var counter = 0;
            list.each(function() {
                counter++;
            });

            expect(counter).to.eql(3);
        });

        it('Should execute a callback on each item of the list, using initial arg', function() {
            var counter = 0;
            var fn = function(data, item) {
                counter++;
                data.str += item.a;
                return data;
            };

            var fnSpy = sinon.spy(fn);
            var initial = {
                str: ''
            };

            var res = list.each(initial, fnSpy);

            expect(counter).to.eql(3);

            expect(res).to.eql({
                str: 'AACCEE'
            });
        });
    });

    describe('filter', function() {
        it.skip('Should filter items and reduce the list', function() {

        });
    });

    describe('sort', function() {
        it.skip('Should sort all items of the lists', function() {

        });
    });

    describe('any', function() {
        it.skip('Should tests wheter one or more items in the list pass the test', function() {

        });
    });

    describe('every', function() {
        it.skip('Should tests wheter all items in the list pass the test', function() {

        });
    });

    describe('reset', function() {
        it.skip('Should reset a list', function() {

        });
    });

    describe('toArray', function() {
        it.skip('Should return an array of all items and its values', function() {

        });
    });

    describe.skip('remove', function() {
        var list, model1, model2, model3;

        beforeEach(function() {
            list = new XQCore.List();
            model1 = new XQCore.Model();
            model1.set({
                id: 1,
                a: 'AA',
                b: 'BB'
            });

            model2 = new XQCore.Model();
            model2.set({
                id: 2,
                a: 'CC',
                b: 'DD'
            });

            model3 = new XQCore.Model();
            model3.set({
                id: 3,
                a: 'EE',
                b: 'FF'
            });

            list.push([model1, model2, model3]);
        });

        it('Should remove an item from the list by a given index', function() {
            var removed = list.remove(1);
            expect(removed).to.be(model2);
        });
    });

    describe('replace', function() {
        it.skip('Should replace an item by a given index', function() {

        });
    });

    describe('sync', function() {
        it.skip('Should be a plain overridable method', function() {

        });
    });
});
