'use strict';

var testberry = require('testberry');

/*eslint no-undef: 0 */
describe('Testberry tests', function() {
  it('Create element', function() {
    let dom = document.createElement('div');
    let list;
    let firstLi;
    let secondLi;

    testberry.bench('Render with innerHTML', function() {
      dom.innerHTML = '<ul class="list"><li class="first"><span>First item</span></li><li class="second"><span>Second item</span></li></ul>';

      list = dom.getElementsByClassName('list')[0];
      firstLi = dom.getElementsByClassName('first')[0];
      secondLi = dom.getElementsByClassName('second')[0];
    });

    console.log(list, firstLi, secondLi);
  });

  it('Create element', function() {
    let dom = document.createElement('div');
    let list;
    let firstLi;
    let secondLi;

    testberry.bench('Render with createElement', function() {
      list = document.createElement('ul');
      list.className = 'list';
      first = document.createElement('li');
      first.className = 'first';
      firstSpan = document.createElement('span');
      firstSpan.textContent = 'first item';

      dom.appendChild(list);
      list.appendChild(first);
      first.appendChild(firstSpan);

      second = document.createElement('li');
      second.className = 'second';
      secondSpan = document.createElement('span');
      secondSpan.textContent = 'second item';

      list.appendChild(second);
      second.appendChild(secondSpan);

      firstLi = dom.getElementsByClassName('first')[0];
      secondLi = dom.getElementsByClassName('second')[0];
    });

    console.log(list, firstLi, secondLi);
  });
});
