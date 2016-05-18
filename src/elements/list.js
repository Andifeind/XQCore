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
      let html = '';
      for (let item of data) {
        html += '<li>' + item + '</li>';
      }

      this.el.innerHTML = html;
    }
  }

  push(data) {
    this.el.innerHTML += '<li>' + data + '</li>';
  }
}

module.exports = ListElement;
