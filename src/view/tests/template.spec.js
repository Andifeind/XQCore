describe('Template', function() {
  'use strict';
  
  beforeEach(function() {

  });

  afterEach(function() {

  });

  describe('insert', function() {
    it('Should insert data into a list of items', function() {
      var tmpl = function(data, h, scopes) {
        var str = '';
        scopes = scopes || {};
        scopes.scope001 = function(data) {
          return '<li><h2>' + data.name + '</h2>' + h.if(data.image, scopes.scope002) + '<div class="description">' + data.descrition + '</div></li>';
        };

        scopes.scope001.path = 'data.listing';
        scopes.scope001.type = 'each';

        scopes.scope002 = function(data) {
          return '<img src="' + data.image + '">';
        };

        str += '<div class="view"><h1>' + data.title + '</h1><div class="listing"><ul class="scope001" scope-id="data.listing" scope-type="each">';
        str += h.each(data.listing, scopes.scope001);
        str += '</ul></div></div>';
        
        return str;
      };

      var scopes = {};
      tmpl({ listing: [] }, { each: function() {} }, scopes);
      expect(scopes.scope001.path).to.eql('data.listing');

    });
  });
});