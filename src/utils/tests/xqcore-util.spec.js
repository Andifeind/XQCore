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
});