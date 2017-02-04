'use strict';

/**
 * XQCore core module
 * @module XQCore
 */

/**
 * XQCore main object
 *
 * @package XQcore
 * @type {Object}
 */
var XQCore = {
  /**
   * Contains the current XQCore version
   * @property {String} version
   */
  version: '0.13.1',

  /**
   * Defines a default route
   * @property {String} defaultRoute
   */
  defaultRoute: '/',

  /**
   * Enables html5 routing support
   * @property {Boolean} html5Routes
   * @default false
   */
  html5Routes: false,

  /**
   * Defines a base path of your projewt
   * @type {String}
   */
  basePath: '',

  /**
   * Sets a hashbang for routing. This value is added to each route if html5Routes is set to false
   * @property {String} hashBang
   */
  hashBang: '#!',

  /**
   * Sets the default template engine
   * @property {String} templateEngine
   * @default firetpl
   */
  templateEngine: 'firetpl',

  /**
   * Sets a views directory
   * @property {String} viewsDir
   */
  viewsDir: './views/',

  /**
   * Set the file extension for views
   * @property {String} viewExt
   */
  viewExt: '.fire',

  /**
   * Defines a default socket port
   * @property {Number} socketPort
   * @default 9889
   */
  socketPort: 9889,

  /**
   * Sets max length of event listener
   * @property {Number} eventListenerMaxLength
   * @default  1328
   */
  eventListenerMaxLength: 1328
};


/**
 * Merges the properties from one or more objects together into a target object
 * Its simply an alias for jQuery.extend.
 *
 * @method extend
 * @param {Boolean} [deep] If true, a deep merge is using
 * @param {Object} target Target object. This object will be extended with new properties
 * @param {Object} [object1] Object to merge
 * @param {Object} [objectN] Object to merge
 * @return {Object} Returns the merged target object
 * @example {js}
 * var target = {
 *     a: 'A1',
 *     b: 'B1'
 * }
 *
 * var obj1 = {
 *     b: 'B2',
 *     c: 'C2'
 * }
 *
 * extend(target, obj1);
 * //Returns {a: 'A1', b: 'B2', c: 'C2'}
 *
 */
Object.defineProperty(XQCore, 'extend', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: function(target) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }

      nextSource = Object(nextSource);

      var keysArray = Object.keys(nextSource);
      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }

    return to;
  }
});

/**
 * Checks whether an value is a plain object
 *
 * Tests if an value is an object and was declared with `{}` and it hasn't any prototyped properties
 *
 * @method isPlainObject
 *
 * @param {Object} obj The value which should be checked
 * @returns {Boolean} Returns true if value is a function, otherwise returns false
 */
XQCore.isPlainObject = function(obj) {

};


/**
 * Checks whether an value is a function
 * @method isPlainObject
 *
 * @param {Object} obj The value which should be checked
 * @returns {Boolean} Returns true if value is a plain object, otherwise returns false
 */
XQCore.isFunction = function(fn) {
  return typeof fn === 'function';
}

/**
 * Checks for a valid ObjectId
 *
 * The pattern of an objectId can be overwritten by setting the XQCore.objectIdPattern property
 *
 * @return {Boolean} Returns true if value is an valid objectId
 */
XQCore.isObjectId = function(value) {
  return (/^[a-zA-Z0-9]{24}$/).test(value);
};

/**
 * Set a local for the current session
 *
 * @method setLocale
 * @param  {String}  locale Local string
 */
XQCore.setLocale = function(locale) {
  localStorage.setItem('xqcore.locale', locale);
};

/**
 * Returns a local string
 * @method getLocale
 * @return {[type]}  [description]
 */
XQCore.getLocale = function() {
  var locale = localStorage.getItem('xqcore.locale');
  if (locale) {
    return locale;
  }

  return navigator.language;
};

/**
 * Defines a global log level
 *
 * XQCore has 5 log levels
 *
 * 0 = off
 * 1 = error
 * 2 = warning
 * 3 = info
 * 4 = debug
 * 5 = trace
 *
 * @property {String} logLevel
 */
XQCore.logLevel = 1;

/**
 * Returns one or all queries
 * Converts all numeric items to a Number
 *
 * @method getQuery
 * @param  {String} name Query name
 * @return {Object|String}      Returns all queries or one value.
 */
XQCore.getQuery = function(name) {
  if (!XQCore.__query) {
    XQCore.__query = {};
    location.search.substr(1).split('&').forEach(function(q) {
      q = q.split('=');
      if (q && q[0]) {
        var val = encodeURI(q[1]);
        XQCore.__query[q[0]] = (isNaN(val) ? val : Number(val));
      }
    });
  }

  if (name) {
    return XQCore.__query[name];
  }
  else {
    return XQCore.__query;
  }
};

/**
 * Checks whether an object is an empty object
 * @param  {Object}  obj Object which should be checked
 * @return {Boolean}     Returns true if object is empty
 */
XQCore.isEmptyObject = function(obj) {
  for (var name in obj) { // eslint-disable-line
    return false;
  }
  return true;
};

/**
 * Checks whether an object is an empty object or an empty array
 * @param  {Object|Array}  obj Object which should be checked
 * @return {Boolean}     Returns true if obj is empty
 */
XQCore.isEmpty = function(obj) {
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  return XQCore.isEmptyObject(obj);
};

/**
 * Create a component
 */
XQCore.cmp = function(cmpName, property) {
  var cmp = new XQCore.Component(cmpName);
  return cmp;
};

XQCore.registerComponent = function(name, cmp) {
  return XQCore.Component.registerComponent(name, cmp);
};

XQCore.getComponent = function(name, cmp) {
  return XQCore.Component.getComponent(name, cmp);
};

/**
 * Extends XQCore with some usefull functions
 *
 * @module  XQCore.Utils
 */
'use strict';

XQCore.undotify = function(path, obj) {
  if(path) {
    path = path.split('.');
    path.forEach(function(key) {
      obj = obj ? obj[key] : undefined;
    });
  }

  return obj;
};

/**
 * Creates a object from an dotified key and a value
 *
 * @public
 * @method dedotify
 *
 * @param {Object} obj Add new value to obj. This param is optional.
 * @param {String} key The dotified key
 * @param {Any} value The value
 *
 * @returns {Object} Returns the extended object if obj was set otherwis a new object will be returned
 */
XQCore.dedotify = function(obj, key, value) {

  if (typeof obj === 'string') {
    value = key;
    key = obj;
    obj = {};
  }

  var newObj = obj;

  if(key) {
    key = key.split('.');
    var len = key.length;
    key.forEach(function(k, i) {
      if (i === len - 1) {
        if (/\[\]$/.test(k)) {
          k = k.substr(0, k.length - 2);
          if (!obj[k]) {
            obj[k] = [];
          }
          obj[k].push(value);
          return;
        }

        obj[k] = value;
        return;
      }

      if (!obj[k]) {
        obj[k] = {};
      }

      obj = obj[k];
    });
  }

  obj = value;

  return newObj;
};

/**
 * Creates a unique id
 *
 * @param {Number} len (Optional) String length. Defaults to 7
 * @returns {String} Unique string
 */
XQCore.uid = function(len) {
  len = len || 7;
  var str = '';

  while (str.length < len) {
    var part = Math.random().toString(36).substr(2);
    str += part;
  }

  return str.substr(0, len);
};

/**
 * Returns a promise object
 *
 * the returning object has two extra methods
 *
 * `resolve` to resolv the promise
 * `reject` to reject the promise
 *
 * If callback is set it will be called, when promise will be resolved or rejected.
 * Gets the reject data as first argument and the resolve data as second argument
 *
 * @example {js}
 * var promise = XQCore.promise();
 * promise.then(function() {
 *     console.log('Resolve');
 * });
 *
 * setTimeout(function() {
 *     promise.resolve();
 * }, 100);
 *
 * @method promise
 * @param  {Function} [callback] Callback function, to be called on resolv or rejecting the promise
 * @return {Object} Returns a promise object
 */
XQCore.promise = function(callback) {

  var s, r;
  var promise = new XQCore.Promise(function(resolve, reject) {
    s = resolve;
    r = reject;
  });

  promise.resolve = function(data) {
    s(data);
    if (typeof callback === 'function') {
      callback(null, data);
    }

    return promise;
  };

  promise.reject = function(data) {
    r(data);
    if (typeof callback === 'function') {
      callback(data);
    }

    return promise;
  };

  var chain = [];

  promise.push = function(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Could not create a promise chain! First arg is not a function in promise.push().');
    }

    chain.push(fn);
    return this;
  };

  promise.each = function(data) {
    var p = chain.shift();
    if (!p) {
      promise.resolve(data);
      return;
    }

    p(data).then(function(data) {
      promise.each(data);
    }).catch(function(err) {
      promise.reject(err);
    });

    return promise;
  };

  return promise;
};

/**
 * Walks recursive through a nested object tree
 * @param  {object|array}  tree Tree object
 * @param  {Function} fn   Call function on each item
 * @return {object|array}  Returns a resolved tree response
 */
XQCore.recurse = function(tree, fn) {
  var res;
  var i;
  if (Array.isArray(tree)) {
    res = [];

    for (i = 0; i < tree.length; i++) {
       res.push(fn(tree[i], function(data) {
         return XQCore.recurse(data, fn)
       }));
    }

    return res;
  }
  else if (tree && typeof tree === 'object') {
    var keys = Object.keys(tree);
    res = {};

    for (i = 0; i < keys.length; i++) {
       res[keys]= fn(tree[keys[i]], fn);
    }

    return res;
  }

};

XQCore.assign = Object.assign || function(target) {
  'use strict';
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  target = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source != null) {
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
  }
  return target;
};

/**
 * Registers a route listener and couples a presenter to it
 *
 * Calls presenter.active() if changed route is route
 * and calls presenter.inactive() on all other route changes if presenter is active
 *
 * @method function
 * @param {string} route Route
 * @param {function} cb Callback function. Gets a presenter instance as its first argument
 *
 * @returns {object} Returns a presenter
 *
 * @example {js}
 * XQCore.route('/foo', function(self) {
 *   self.active = function(route) {
 *   	 console.log('Route /foo called', router);
 *   };
 * });
 */
XQCore.route = function(route, fn) {
  var routeName = 'route' + route;
  var presenter = new XQCore.Presenter(routeName, fn);
  presenter.path = route;
  presenter.route(route, function(router) {
    presenter.active(router);
  });

  return presenter;
};

//--

module.exports = XQCore;
