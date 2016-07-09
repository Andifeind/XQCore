'use strict';

let EventEmitter = require('../xqcore-event');

/**
 * Root element
 *
 * @class RootElement
 * @extends XQFire.Event
 */
class RootElement extends EventEmitter {

  /**
   * Element constructor
   *
   * @chainable
   * @return {object} Returns this value
   */
  constructor() {
    super();
    this.tag = 'section'
  }

  /**
   * Creates dom element
   *
   * @chainable
   * @return {object} Returns this value
   */
  create() {
    let tagName = this.constructor.name;
    this.el = document.createElement(this.tag);
    this.el.className = tagName;
    this.render({});

    if (this.$change) {
      this.el.addEventListener('change', ev => {
        this.emit('change', this.$change(ev), ev);
      });
    }
  }

  append(el) {
    if (Array.isArray(el)) {
      for (var i = 0; i < el.length; i++) {
        this.el.appendChild(el[i].el);
      }

      return;
    }
    else if (typeof el === 'string') {
      let docFrac = document.createDocumentFragment();
      let div = document.createElement('div');
      div.innerHTML = el;
      for (let item of div.children) {
        docFrac.appendChild(item);
      }
      this.el.appendChild(docFrac);
    }
    else {
      this.el.appendChild(el.el);
    }
  }

  render(data) {
    if (this.tmpl) {
      let html = this.tmpl;
      if (typeof html === 'function') {
        html = html(data);
      }

      this.el.innerHTML = html;
    }
  }
}

module.exports = RootElement
