let RootElement = require('./root');

class InputElement extends RootElement {
  constructor() {
    super();

    this.tag = 'input';
    this.attrs = {
      type: 'text'
    };
  }

  $change(ev) {
    return ev.value;
  }
}

module.exports = InputElement;
