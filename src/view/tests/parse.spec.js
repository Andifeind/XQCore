describe.only('Parse', function() {
  'use strict';

  var parse = function(source) {
    var pattern = /^\s*(?:(?:<([a-zA-Z0-9:-]+))|(?:<\/([a-zA-Z0-9:-]+)>)|([a-zA-Z0-9]+="[a-zA-Z0-9]+")|(>)|(\{\{[a-zA-Z0-9]+\}\})|([^<]+))/g;
    var d = 0;
    var out = [];
    var pos = 0;

    while (++d < 1000) {
      pattern.lastIndex = 0;
      console.log(source.substr(pos));
      var match = pattern.exec(source.substr(pos));
      console.log(pattern.lastIndex);
      console.log(match);
      if (!match) {
        console.log('Error');
        break;
      }

      if (match[1]) {
        out.push({ type: 'tag', value: match[1] });
      }
      else if (match[2]) {
        out.push({ type: 'close-tag', value: match[2] });
      }
      else if (match[3]) {
        out.push({ type: 'attrs', value: match[3] });
      }
      else if (match[4]) {
        out.push({ type: 'tag-end', value: match[4] });
      }
      else if (match[5]) {
        out.push({ type: 'placeholder', value: match[5] });
      }
      else if (match[6]) {
        out.push({ type: 'string', value: match[6] });
      }
      else {
        out.push({ type: 'other', value: match[0] });
        console.log('Error');
      }

      console.log('Change pos from ' + pos + ' to ' + (pos + pattern.lastIndex));
      pos += pattern.lastIndex;

      console.log(pattern);
    }

    return out;
  };

  beforeEach(function() {

  });

  afterEach(function() {

  });

  describe('parse', function() {
    it('Should parse a template file', function() {
      var template = '<div class="test"><h1>Title</h1><div class="description">{{content}}</div></div>';
      expect(parse(template)).to.eql([
        { type: 'tag' }
      ]);
    });
  });
});