let RootElement = require('./root');

class InputElement extends RootElement {
  constructor() {
    super();

    this.tag = 'input';
    this.attrs = {
      type: 'text'
    };
  }

  listener() {
    this.el.addEventListener('change', ev => this.$change({
      value: ev.value
    }, ev));
  }

  onChange() {

  }
}

module.exports = InputElement;
