let RootElement = require('./root');

class PageHeader extends RootElement {
  constructor() {
    super();

    this.tag = 'header';
  }
}

module.exports = PageHeader;
