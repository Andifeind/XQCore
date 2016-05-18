let RootElement = require('./root');

class ListElement extends RootElement {
  constructor() {
    super();

    this.tag = 'ul';
    this.attrs = {
      type: 'text'
    };
  }

  render(data) {
    if (Array.isArray(data)) {
      for (let item of data) {
        this.push(item);
      }
    }
  }

  push(data) {
    let item = this.item;
    this.append(item(data));
  }
}

module.exports = ListElement;
