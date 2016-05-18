'use strict';

/*eslint no-undef: 0 */
describe.only('Testberry tests', function() {
  let TESTLIST = '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>' +
    '<li>Test list I</li><li>Test list II</li><li>Test list III</li>';

  it('Document create', function() {
    let testDom = document.createElement('section');
    testberry.test('Document create', function() {
      let div = document.createElement('div');
      div.innerHTML = TESTLIST;
      while(div.firstChild) {
        testDom.appendChild(div.firstChild);
      }
    });

    expect(testDom.childNodes).to.have.length(99);
  });

  it('Document fragment with proxy div', function() {
    let testDom = document.createElement('section');
    testberry.test('Document fragment with proxy div', function() {
      let docFrag = document.createDocumentFragment();
      let div = document.createElement('div');
      div.innerHTML = TESTLIST;
      while(div.firstChild) {
        docFrag.appendChild(div.firstChild);
      }

      testDom.appendChild(docFrag);
    });

    expect(testDom.childNodes).to.have.length(99);
  });

  it('Document fragment with range', function() {
    let testDom = document.createElement('section');
    testberry.test('Document fragment with range', function() {
      let range = document.createRange();
      let docFrag = range.createContextualFragment(TESTLIST);
      testDom.appendChild(docFrag);
    });

    expect(testDom.childNodes).to.have.length(99);
  });
});
