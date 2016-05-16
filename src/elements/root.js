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
  }

  append(el) {
    if (Array.isArray(el)) {
      for (var i = 0; i < el.length; i++) {
        this.el.appendChild(el[i].el);
      }

      return;
    }

    this.el.appendChild(el.el);
  }
}

module.exports = RootElement
