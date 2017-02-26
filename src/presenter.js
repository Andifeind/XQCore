/**
 * XQCore Presenter
 *
 * A presenter controlls your models, lists and views.
 * It renders views as long as any data had been changed.
 *
 * @module XQCore.Presenter
 */

'use strict';


var XQCore = require('./xqcore');
var Logger = require('./logger');
var Router = require('./router');
var EventEmitter = require('./event');
var List = require('./list');
var Model = require('./model');
var View = require('./view');
var Tmpl = require('./tmpl');

var log;

/**
 * XQCore.Presenter base class
 *
 * @class XQCore.Presenter
 * @constructor
 *
 * @uses XQCore.Logger
 * @uses XQCore.EventEmitter
 *
 * @param {String} name Presenter name
 * @param {Function} fn Init callback and presenter scope method. To be called during the instantiating progress
 */
var Presenter = function(name, fn) {
  var self = this;

  if (typeof arguments[0] !== 'string') {
    fn = name;
    name = '';
  }

  /**
   * Set presenter name
   * @public
   * @type {String}
   */
  this.name = name || 'Nameless';
  this.path = '/' + (name === 'index' ? '' : name);

  /**
   * Router instance
   * @private
   * @type {Object}
   */
  this.router = Router.getInstance();

  /**
   * Logger instance
   * @ignore
   * @type {Object}
   */
  log = new Logger(this.name + 'Presenter');

  /**
   * Stores registered views
   * @private
   * @type {Object}
   */
  this.__views = {};

  //-- Initial config mapping
  if (typeof fn === 'function') {
    fn.call(this, self, log);
  }

  // register presenter route handler
  this.route(this.path);
};

XQCore.extend(Presenter.prototype, new EventEmitter());

/**
 * Add a history item to the browser history
 *
 * @method pushState
 *
 * @param {String} url Page URL (Optional) defaults to the curent URL
 * @param {Object} data Data object
 */
Presenter.prototype.pushState = function(url, data) {
  // log.info('Check State', data, history.state, XQCore.compare(data, history.state));
  // if (XQCore.compare(data, history.state)) {
  //     this.warn('Abborting history.pushState because data are equale to current history state');
  // }
  var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
  url = hash + url;
  history.pushState(data, '', url || null);
  log.info('Update history with pushState. New URL: ' + data, url);
};

/**
 * Add a history item to the browser history
 *
 * @method replaceState
 *
 * @param {String} url Page URL (Optional) defaults to the current URL
 * @param {Object} data Data object
 */
Presenter.prototype.replaceState = function(url, data) {
  var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
  url = hash + url;
  history.replaceState(data, '', url || null);
  log.info('Update history with replaceState. New URL: ' + data, url);
};

/**
 * Navigates to a given route
 *
 * @method  navigateTo
 *
 * Options: {
 *  replace: <Boolean> Replace current history entry with route (Only when html5 routes are enabled)
 *  noPush: <Boolean> Set this to false to surpress a route change when new route equals to old route
 * }
 *
 * @param {String} route Route url
 * @param {Object} options Options
 */
Presenter.prototype.navigateTo = function(route, options) {
  //TODO check route trigger
  options = options || {};
  if (XQCore.html5Routes) {
    this.router.callRoute(route, options);
  }
  else {
    location.hash = XQCore.hashBang + route;
    this.router.callRoute(route, options);
  }
};

/**
 * Navigate back
 *
 * @method navigateBack
 */
Presenter.prototype.navigateBack = function() {
  history.back();
};

/**
 * Gets a view by it's name
 *
 * @method getView
 * @param {String} viewName Required view name
 * @return {Object} Returns view object or null if no view was found
 */
Presenter.prototype.getView = function(viewName) {
  return this.__views[viewName] || null;
};

/**
 * Returns the current hash
 *
 * @method getHash
 * @returns {String} Returns the current value from location.hash
 */
Presenter.prototype.getHash = function() {
  return location.hash;
};

/**
 * Returns the current pathname
 *
 * @method getPathname
 * @returns {String} Returns the current value from location.pathname
 */
Presenter.prototype.getPathname = function() {
  return location.pathname;
};

/**
 * Couple a model with a view
 *
 * @method couple
 * @chainable
 * @param {Object} conf Configuration object
 *
 * conf: {
 *   model: String modelname
 *   view: String viewname
 *   route String routename
 * }
 */
Presenter.prototype.couple = function(view, model, conf) {
  conf = conf || {};

  if (model instanceof List) {
    this.coupleList(view, model, conf);
  }
  else {
    this.coupleModel(view, model, conf);
  }

  this.coupleView(view, model, conf);
};

Presenter.prototype.coupleComponent = function(cmp, model) {
  model = new model();
  if (model instanceof List) {
    var list = model;
    list.on('item.push', function(item) {
      if (Array.isArray(item)) {
        item.forEach(function(model) {
          var val = model.get();
          cmp.push(val);
        });

        return;
      }

      var val = item.get();
      cmp.push(val);
    });

    list.on('item.unshift', function(item) {
      if (Array.isArray(item)) {
        item.forEach(function(model) {
          var val = model.get();
          cmp.unshift(val);
        });

        return;
      }

      var val = item.get();
      cmp.unshift(val);
    });
  }
  else {
    if (cmp.$change) {
      cmp.$change(function(data, ev, curCmp) {
        model.set(data.name, data.value).then(function() {
          curCmp.errMessage = null;
        }).catch(function(err) {
          curCmp.errMessage = err.err[0].msg;
        });
      });
    }

    if (cmp.$click) {
      cmp.$click(function(data, ev, curCmp) {
        model.set(data.name, data.value).then(function() {
          curCmp.errMessage = null;
        }).catch(function(err) {
          curCmp.errMessage = err.err[0].msg;
        });
      });
    }

    if (cmp.$submit) {
      cmp.$submit(function(data, ev, curCmp) {
        model.save().then(function() {
          log.debug('Model saved!', model);
        }).catch(function(err) {
          curCmp.errMessage = err.err[0].msg;
        });
      });
    }

    cmp.on('value.change', function(data) {
      model.set(data.name, data.value).then(function() {
        cmp.errMessage = null;
      }).catch(function(err) {
        cmp.errMessage = err.err[0].msg;
      });
    });

    model.on('validation.error', function(validationResult, other) {
      cmp.state = 'invalid';
    });

    model.on('state.change', function(state) {
      cmp.state = state;
    });
  }
};

/**
 * Couples a view onto a model
 *
 * @method coupleModel
 * @param {Object} view XQCore.View instance
 * @param {Object} model XQCore.Model instance
 */
Presenter.prototype.coupleModel = function(view, model, conf) {
  conf = conf || {};

  if (!(view instanceof View)) {
    return log.error('Could not couple model with view. First arg is not a valid view!');
  }

  if (!(model instanceof Model)) {
    return log.error('Could not couple model with view. Second arg is not a valid model!');
  }

  if (model.__coupled) {
    model.__coupled.uncouple();
    // return log.error('View', view.name, 'already coupled with', view.__coupled.obj.name, '. Only one model or list can be coupled with a view!');
  }

  log.info('Couple model', model.name, 'with', view.name);

  model.__coupled = {
    obj: view,
    events: [],
    uncouple: function() {
      log.info('Uncouple model', model.name, 'from', view.name);
      model.__coupled.events.forEach(function(ev) {
        ev.remove();
      });

      delete model.__coupled;
    }
  };

  var eventsMap = {
    'data.replace': 'render',
    'data.set': 'render',
    'value.set': 'change',
    // 'item.insert': 'xrender',
    'item.remove': 'remove',
    'validation.error': 'validationFailed',
    'state.change': 'onStateChange'
  };

  var listener = function(listener, func) {
    var fn = typeof func === 'function' ? func : view[func].bind(view);
    var handler = model.on(listener, fn);
    model.__coupled.events.push(handler);
  };

  for (var key in eventsMap) {
    if (eventsMap.hasOwnProperty(key)) {
      listener(key, eventsMap[key]);
    }
  }

  //Initial view render with current model data
  view.render(model.get());

};

/**
 * Couples a listwith a view
 *
 * @method coupleList
 * @param {Object} view XQCore.View instance
 * @param {Object} model XQCore.Model instance
 */
Presenter.prototype.coupleList = function(view, list) {
  if (!(view instanceof View)) {
    return log.error('Could not couple list with view. First arg is not a valid view!');
  }

  if (!(list instanceof List)) {
    return log.error('Could not couple list with view. Second arg is not a valid list!');
  }

  if (list.__coupled) {
    list.__coupled.uncouple();
    // return log.error('View', view.name, 'already coupled with', view.__coupled.obj.name, '. Only one model or list can be coupled with a view!');
  }

  log.info('Couple list', list.name, 'with', view.name);

  list.__coupled = {
    obj: view,
    events: [],
    uncouple: function() {
      log.info('Uncouple list', list.name, 'from', view.name);
      list.__coupled.events.forEach(function(ev) {
        ev.remove();
      });

      delete list.__coupled;
    }
  };

  var eventsMap = {
    'item.push': function(data) {
      view.append('_ftl_root', data[0].toJSON());
    },
    'item.unshift': 'prepend',
    'item.pop': 'removeLast',
    'item.shift': 'removeFirst',
    'item.update': 'update',
    'item.remove': function(item, index) {
      view.remove('_ftl_root', index);
    },
    'state.change': 'onStateChange'
  };

  var listener = function(listener, func) {
    var fn = typeof func === 'function' ? func : view[func].bind(view);
    var handler = list.on(listener, fn);
    list.__coupled.events.push(handler);
  };

  for (var key in eventsMap) {
    if (eventsMap.hasOwnProperty(key)) {
      listener(key, eventsMap[key]);
    }
  }

  //Initial view render with current list data
  view.render(list.toArray());

};

/**
 * Couples a view with a model or a list
 *
 * @method coupleView
 * @param {Object} view View instance
 * @param {Object} model Model or List instance
 */
Presenter.prototype.coupleView = function(view, model) {
  if (!(view instanceof View)) {
    return log.error('Could not couple list with view. First arg is not a valid view!');
  }

  if (!(model instanceof Model) && !(model instanceof List)) {
    return log.error('Could not couple list with view. Second arg is not a valid model or list!');
  }

  if (view.__coupled) {
    view.__coupled.uncouple();
    // return log.error('Model or List', model.name, 'already coupled with', model.__coupled.obj.name, '. Only one view can be coupled with a model or a list !');
  }

  log.info('Couple view', view.name, 'with', model.name);

  view.__coupled = {
    obj: model,
    events: [],
    uncouple: function(onlySelf) {
      log.info('Uncouple view', view.name, 'from', model.name);
      view.__coupled.events.forEach(function(ev) {
        ev.remove();
      });

      delete view.__coupled;
    }
  };

  var eventsMap;
  if (model instanceof Model) {
    eventsMap = {
      'form.submit': 'submit',
      'input.change': 'set',
      'input.edit': function(key, value) {
        var check = model.checkValidation(key, value);
        if (check) {
          view.validationSucceeded(key, value);
        }
        else {
          view.validationFailed([{
            property: name
          }]);
        }
      }
    };
  }
  else {
    eventsMap = {
      'form.submit': 'submit'
    };
  }

  var listener = function(listener, func) {
    var fn = typeof func === 'function' ? func : model[func].bind(model);
    var handler = view.on(listener, fn);
    view.__coupled.events.push(handler);
  };

  for (var key in eventsMap) {
    if (eventsMap.hasOwnProperty(key)) {
      listener(key, eventsMap[key]);
    }
  }

};

/**
 * Initialize a new view into the presenter scope
 *
 * options: {
 *   mode: String       Insert mode, (append, prepend or replace) replace is default
 *   inject: Boolean    Set to false to disable injecting view into the DOM
 *   forms: Boolean|String     View has forms. Add a selector here or set this to true to find all forms
 * }
 *
 * @method initView
 * @public
 * @param  {String} viewName  Name of the view
 * @param  {String} container Container selector, default is 'body'
 * @param  {Object} options   View options
 * @return {Object}           Returns a view object
 */
Presenter.prototype.initView = function(viewName, container, options) {
  options = options || {};
  var tmplOptions = {};

  if (options.viewDir) {
    tmplOptions.viewDir = options.viewDir;
  }

  var view = new View(viewName, function(self) {
    self.template = Tmpl.getTemplate(viewName, tmplOptions);
    self.mode = options.mode || 'replace';
    self.container = container || 'body';
    self.hidden = !!options.hidden;
    self.forms = options.forms;
    if (options.inject === false) {
      self.autoInject = false;
    }
  });

  this.__views[viewName] = view;

  var self = this;
  if (XQCore.html5Routes) {
    view.on('xqcore.navigate', function(url) {
      self.router.callRoute(url);
    });
  }

  return view;
};

/**
 * Register a route listener
 *
 * @method route
 * @param {String|Array} route Route string
 * @param {Function} callback Callback function
 *
 * @chainable
 * @returns {Object} Returns this value
 */
Presenter.prototype.route = function(route, callback) {
  var self = this;

  if (typeof callback === 'string') {
    callback = this[callback];
  }

  if (typeof callback === 'function') {
    if (typeof route === 'string') {
      this.router.addRoute(route, callback);
    }
    else if (Array.isArray(route)) {
      route.forEach(function(r) {
        self.router.addRoute(r, callback);
      });
    }
  }
  else {
    log.warn('Router callback isn\'t a function', callback, 'of route', route);
  }

  return this;
};

Presenter.prototype.createView = function (viewTree) {
  log.debug('Render view tree', viewTree);

  var tree = XQCore.recurse([viewTree], function(data, next) {
    var tagName = data.name;
    var view = new View(tagName);
    var childs = next(data.childs);
    if (childs) {
      view.append(childs);
    }

    if (data.model) {
      var model = new XQCore.__models[data.model]();

      if (view.el.$change) {
        view.el.on('change', function(evData) {
          if (data.prop) {
            model.set(data.prop, evData);
          }
        });
      }
    }
    else if (data.list) {
      var list = new XQCore.__lists[data.list]();

      if (view.el.$change) {
        view.el.on('change', function(evData) {
          if (data.prop) {
            var listItem = {};
            listItem[data.prop] = evData;
            list.add(listItem);
          }
        });
      }

      if (view.el.push) {
        list.on('item.push', function(model) {
          view.el.push(model[0].get());
        });

        list.each(function(model) {
          view.el.push(model.get());
        });
      }
    }

    return view;
  });

  document.addEventListener('DOMContentLoaded', function() {
    tree[0].injectInto(document.body);
  });
};

// New supershitty methods

/**
 * Active method, called when presenter gets active
 *
 * @method active
 * @override
 * @version 1.0.0
 *
 * @param  {function} fn Callback function. First argument is a Router object
 *
 * @chainable
 * @return {object} Returns this value
 */
Presenter.prototype.active = function(fn) {
  log.debug('Activate presenter, no active() method was set for route ' + this.path);
  return this;
}

/**
 * Inactive method, called when presenter gets inactive
 *
 * @method inactive
 * @override
 * @version 1.0.0
 *
 * @param  {function} fn Callback function. First argument is a Router object
 *
 * @chainable
 * @return {object} Returns this value
 */
Presenter.prototype.inactive = function(fn) {
  log.debug('Inactivate presenter, no inactive() method was set for route ' + this.path);
  return this;
}

//--

module.exports = Presenter;
