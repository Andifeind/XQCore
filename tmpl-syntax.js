/* jshint multistr:true, strict:false */
var tmpl;

tmpl = '<div class="view">\
	<h1>{{title}}</h1>\
	<div class="listing">\
		<ul>\
			{{#each listing "ul class="listing"}}\
				<li>\
					<h2>{{name}}</h2>\
					{{#if image}}\
						<img src="{{image}}">\
					{{/if}}\
					<div class="description">{{descrition}}</div>\
				</li>\
			{{/each}}\
		</ul>\
	</div>\
</div>';

(function(data, h, scopes) {
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
})();