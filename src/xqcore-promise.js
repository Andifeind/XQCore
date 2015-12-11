'use strict';

// var callAll = function(fnStack, data, done) {
//   var next = function() {
//     var nextFn = fnStack.unshift();
//     if (!nextFn) {
//       done();
//     }
//     else {
//       next();
//     }
//   };

//   next();
// };

var Promise = function(fn) {
  this._fullFillFuncs = [];
  this._rejectsFuncs = [];
  this.state = 'pending';
  this.value = null;

  this.onFullFill = function(value) {
    this.state = 'fulfilled';
    this.value = value;
    this._fullFillFuncs.forEach(function(fn) {
      fn(value);
    });
  }.bind(this);

  this.onReject = function(reason) {
    this.state = 'rejected';
    this.reason = reason;
    this._rejectsFuncs.forEach(function(fn) {
      fn(reason);
    });
  }.bind(this);

  fn(this.onFullFill, this.onReject);
};

Promise.resolve = function(value) {
  var promise = new Promise(function(resolve) {
    resolve(value);
  });
  
  return promise;
};

Promise.reject = function(reason) {
  var promise = new Promise(function(resolve, reject) {
    reject(reason);
  });

  return promise;
};

Promise.prototype.then = function(fn) {
  if (this.state === 'pending') {
    this._fullFillFuncs.push(fn);
  }
  else if (this.state === 'fulfilled') {
    fn(this.value);
  }
  return this;
};

Promise.prototype.catch = function(fn) {
  if (this.state === 'pending') {
    this._rejectsFuncs.push(fn);
  }
  else if (this.state === 'rejected') {
    fn(this.reason);
  }
  return this;
};

module.exports = Promise;
