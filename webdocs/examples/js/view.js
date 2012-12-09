var length = 0;

var presenter = new XQCore.Presenter({
	debug: true,
	viewInit: function(view) {
		if (view.name === 'FirstView') {
			view.render({
				items: [
					{name: 'A'},
					{name: 'B'},
					{name: 'C'},
					{name: 'D'}
				]
			});
		}
	},
	events: {
		addItem: function() {
			view1.append({
				name: String.fromCharCode(69 + length)
			});

			++length;
		}
	}
});

var view1 = new XQCore.View(presenter, {
	debug: true,
	name: 'First',
	container: '#view1',
	template: '<ul>\
		{{#each items}}\
			<li>{{name}}</li>\
		{{/each}}\
		</ul>\
		<a class="add">Add Item</a>',
	events: {
		'click .add': 'addItem'
	},
	subSelector: '#view1 > ul',
	itemTemplate: '<li>{{name}}</li>'
});

