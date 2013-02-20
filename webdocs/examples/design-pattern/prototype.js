(function() {

	console.profile();
	// console.time('child declaration');

	for (var i = 0; i < 1000; i++) {

		var Child = function() {
			this.propA2 = 'AA';
			this.propB2 = 'BB';
			this.propC2 = 'CC';
		};

		$.extend(Child.prototype, Parent.prototype);

		//Override parent func
		Child.prototype.funcA = function() {
			return 'A2';
		};
		//Override parent func
		Child.prototype.funcB = function() {
			return 'B2';
		};
		//Override parent func
		Child.prototype.funcC = function() {
			return 'C2';
		};
		//Override parent func
		Child.prototype.funcD = function() {
			return 'D2';
		};


		Child.prototype.funcE2 = function() {
			return 'E2';
		};
		Child.prototype.funcF2 = function() {
			return 'F2';
		};
		Child.prototype.funcG2 = function() {
			return 'G2';
		};
		Child.prototype.funcH2 = function() {
			return 'H2';
		};

		var child = new Child();
	}

	// console.timeEnd('child declaration');
	console.profileEnd();

})();