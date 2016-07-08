'use strict';

let RootElement = require('./root');

class NotFoundElement extends RootElement {
  constructor() {
    super();

    this.className = 'element-error element-not-found'
    this.attrs = {
      title: 'Element was not found!'
    }
  }
}

module.exports = NotFoundElement;
