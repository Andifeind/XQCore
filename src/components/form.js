/**
 * Form component renders a form based on a FormSchema
 *
 * FormSchema:
 * { name: 'title', type: 'string', min: 3, max: 20 },
 * { name: 'description', type: 'text', min: 3, max: 2000 },
 * { name: 'category', type: 'category', min: 3, max: 200 },
 * { name: 'timer', type: 'string', min: 3, max: 200, multiple: true },
 *
 */

'use strict';

var Core = require('./core');
var Input = require('./input');
var Text = require('./text');
var Button = require('./button');

function Form (schema) {
  Core.call(this);

  this.tag = 'form';
  this.cssClass = 'xq-form';
  this.__items = [];

  this.schema = schema;
}

Form.prototype = Object.create(Core.prototype);
Form.prototype.constructor = Form;

/**
 * Renders a form based on a FormSchema
 * @method render
 *
 * @param {object} data Form data
 *
 * @chainable
 * @return {object} Returns this value
 */
Form.prototype.render = function(data) {
  var html = '';
  if (this.schema) {
    html = this.renderForm(data);
  }
  else if (this.tmpl) {
    html = this.tmpl;
  }

  if (typeof html === 'function') {
    html = html(data);
  }

  if (typeof html === 'object') {
    while (this.domEl.firstChild) {
      this.domEl.removeChild(this.domEl.firstChild);
    }

    this.domEl.appendChild(html);
  }
  else {
    this.domEl.innerHTML = html;
  }

  return this;
};

Form.prototype.renderForm = function(data) {
  var form = document.createDocumentFragment();
  this.inputs = {};

  this.schema.forEach(function(item) {
    var div = document.createElement('div');
    var label = document.createElement('label');

    label.setAttribute('for', item.name);
    label.textContent = item.label === undefined ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : item.label;

    var input;
    if (item.type === 'string') {
      input = new Input(item.name);
      input.create();
      this.inputs[item.name] = input;
    }
    else if (item.type === 'text') {
      input = new Text(item.name);
      input.create();
      this.inputs[item.name] = input;
    }
    else if (item.type === 'button') {
      input = new Button(item.name);
      if (item.action) {
        input.action = item.action;
      }

      input.create();

      if (item.content) {
        input.content = item.content;
      }

      this.inputs[item.name] = input;
    }
    else {
      throw new Error('Input of type ' + item.type + 'isn\'t supported!');
    }

    div.appendChild(label);
    div.appendChild(input.domEl);
    form.appendChild(div);
  }, this);

  return form;
};

Form.prototype.$change = function(fn) {
  var self = this;
  this.listen('change', function(ev) {
    console.log('FORM CHANGE', ev, ev.target.name);
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev, self.inputs[ev.target.name]);
  });
};

Form.prototype.$submit = function(fn) {
  this.listen('submit', function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('FORM SUBMIT', ev, ev.target.name);
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev);
  });
};

module.exports = Form;
