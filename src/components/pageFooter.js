'use strict';

let RootElement = require('./root');

class PageFooter extends RootElement {
  constructor() {
    super();

    this.tag = 'footer';
  }
}

module.exports = PageFooter;
