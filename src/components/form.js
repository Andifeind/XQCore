var Core = require('./core');

/**
 * Form component renders a form based on a FormSchema
 *
 * FormSchema:
 * { name: 'title', type: 'string', min: 3, max: 20 },
 * { name: 'description', type: 'text', min: 3, max: 2000 },
 * { name: 'category', type: 'category', min: 3, max: 200 },
 * { name: 'timer', type: 'string', min: 3, max: 200, multiple: true },
 *
 * @method Form
 */
function Form (schema) {
  Core.call(this);

  this.tag = 'table';
  this.cssClass = 'xq-table';
  this.__items = [];
  this.child = function(data) {
    return '<label><input type="text">' + data.value + '</td></label>';
  };

  this.schema = schema;
}

/**
 * Renders a form based on a FormSchema
 * @method render
 *
 * @param {object} data Form data
 *
 * @chainable
 * @return {object} Returns this value
 */
Core.prototype.render = function(data) {
  var html = '';
  if (this.schema) {
    html = this.renderForm();
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
  } else {
    this.domEl.innerHTML = html;
  }

  return this;
}

Form.prototype.renderForm = function() {
  var form = document.createDocumentFragment();

  this.schema.forEach(function(item) {
    var div = document.createElement('div');
    var label = document.createElement('label');
    label.setAttribute('for', item.name);
    label.textContent = item.label || item.name.charAt(0).toUpperCase() + item.name.slice(1);

    var input;
    if (item.type === 'string') {
      // input =
    }
  });
}

Form.prototype = Object.create(Core.prototype);
Form.prototype.constructor = Form;

module.exports = Form;
