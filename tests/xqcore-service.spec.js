describe.only('XQCore.Service', function() {
    'use strict';
    
    describe('Instance', function() {
        it('Should be an instance of XQCore.Service', function() {
            expect(XQCore.Service).to.be.a('function');
        });

        it('Should have a model property', function() {
            var model = new XQCore.Model('test');
            var service = new XQCore.Service('test', function(self) {
                self.model = model;
            });

            expect(service.isListService).to.be(false);
            expect(service.model).to.be.a(XQCore.Model);
            expect(service.list).to.be(undefined);
        });

        it('Should have a list property', function() {
            var list = new XQCore.List('test');
            var service = new XQCore.Service('test', function(self) {
                self.list = list;
            });

            expect(service.isListService).to.be(true);
            expect(service.list).to.be.a(XQCore.List);
            expect(service.model).to.be(undefined);
        });

        it('Should throw an not connected to any model or list error', function() {
            var fn = function() {
                var service;
                service = new XQCore.Service('test', function(self) {

                });
            };

            expect(fn).to.throwException(/not connected to any model/);
        });

        it('Should throw an connected to a model and a listst error', function() {
            var fn = function() {
                var service;
                service = new XQCore.Service('test', function(self) {
                    self.model = {};
                    self.list = {};
                });
            };

            expect(fn).to.throwException(/connected to a model and a list/);
        });

        it('Should inherit schema from a model', function() {
            var schema = {};
            var model = new XQCore.Model('test', function(self) {
                self.schema = schema;
            });

            var service = new XQCore.Service('test', function(self) {
                self.model = model;
            });

            expect(service.schema).to.equal(schema);
        });

        it('Should inherit schema from a list model', function() {
            var schema = {};
            var model = XQCore.Model.inherit('test', function(self) {
                self.schema = schema;
            });

            var list = new XQCore.List('test', function(self) {
                self.model = model;
            });

            var service = new XQCore.Service('test', function(self) {
                self.list = list;
            });

            expect(service.schema).to.equal(schema);
        });
    });
});