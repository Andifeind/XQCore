describe('Utils', function() {
	'use strict';

	describe('undotify', function() {
		var data = {
			on: {
				the: {
					end: {
						of: {
							the: {
								world: 'Hello World!'
							}
						}
					}
				},
				getting: {
					thirsty: {
						drinking: function() {
							return 'Coffee';
						}
					}
				}
			}
		};

		it('Should return a value from an object by using a dotnotated string as selector', function() {
			var value = XQCore.undotify('on.the.end.of.the.world', data);
			expect(value).to.equal('Hello World!');
		});

		it('Should return a value from an object by using a dotnotated string as selector (Returning a function)', function() {
			var value = XQCore.undotify('on.getting.thirsty', data);
			expect(value.drinking).to.be.a('function');
			expect(value.drinking()).to.equal('Coffee');
		});

		it('Should return a value from an object by using a dotnotated string as selector (Without path)', function() {
			var value = XQCore.undotify(null, data);
			expect(value).to.eql(data);
		});
	});

	describe('dedotify', function() {
		it('Should create a new object from a dotified key and a value', function() {
			var data = XQCore.dedotify('bla.blubb', 'Super blubb');
			expect(data).to.eql({
				bla: {
					blubb: 'Super blubb'
				}
			});
		});

		it('Should extend a existing object from a dotified key and a value', function() {
			var existing = {
				name: 'Andi'
			};
			var data = XQCore.dedotify(existing, 'needs.something', 'Coffee');

			expect(data).to.eql({
				name: 'Andi',
				needs: {
					something: 'Coffee'
				}
			});
		});
	});

	describe('uid', function() {
		it('Should return a unique string', function() {
			var uid = XQCore.uid();
			expect(uid).to.match(/^[a-zA-Z0-9]{7}$/);
		});

		it('Should return a unique string with a length of 10 chars', function() {
			var uid = XQCore.uid();
			expect(uid).to.match(/^[a-zA-Z0-9]{7}$/);
		});

		it('Should return a unique string with a length of 33 chars', function() {
			var uid = XQCore.uid(33);
			expect(uid).to.match(/^[a-zA-Z0-9]{33}$/);
		});

		it('Should return a unique string with a length of 100 chars', function() {
			var uid = XQCore.uid(100);
			expect(uid).to.match(/^[a-zA-Z0-9]{100}$/);
		});

		it('Should check 300000 uid\'s', function() {
			var uid = XQCore.uid();
			for (var i = 0; i < 300000; i++) {
				uid = XQCore.uid();
				if (!/^[a-zA-Z0-9]{7}$/.test(uid)) {
					this.fail('Unvalid uid! ' + uid);
				}
			}

			expect(i).to.eql(300000);
		});

		it('Should check the uniqueness of 10000 uid\'s', function() {
			this.timeout = 1000000;
			var len = 10000;
			var uid = XQCore.uid();
			var arr = [];
			for (var i = 0; i < len; i++) {
				uid = XQCore.uid();
				if (arr.indexOf(uid) === -1) {
					arr.push(uid);
				}
				else {
					this.fail('Not unique');
				}
			}

			expect(arr).to.have.length(len);
		});
	});
});