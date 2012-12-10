var len = 0;

var presenter = new XQCore.Presenter({
	debug: true,
	viewInit: function(view) {
		if (view.name === 'FirstView') {
			//Add data to model1
			model1.set({
				items: [
					{name: 'A'},
					{name: 'B'},
					{name: 'C'},
					{name: 'D'}
				]
			});

			view.render(model1.get());
		}
	},
	events: {
		appendItem: function() {
			var data = model1.append('items', {
				name: String.fromCharCode(69 + len)
			});

			var timer = this.timer('append');
			view1.append(data);
			timer.end();

			++len;
		},
		prependItem: function() {
			var data = model1.prepend('items', {
				name: String.fromCharCode(69 + len)
			});

			var timer = this.timer('prepend');
			view1.prepend(data);
			timer.end();

			++len;
		},
		renderView: function() {
			var timer = this.timer('render');
			view1.render(model1.get());
			timer.end();
		},
		removeItem: function(e, tagData) {
			model1.remove('items', tagData.itemIndex);
			view1.remove(tagData.itemIndex);
		}
	}
});

var model1 = new XQCore.Model({
	debug: true,
	name: 'First'
});

var view1 = new XQCore.View(presenter, {
	debug: true,
	name: 'First',
	container: '#mvp1',
	template: '<ul>\
		{{#each items}}\
			<li>\
				<span class="delete">x</span>\
				{{name}}\
			</li>\
		{{/each}}\
		</ul>\
		<a class="append">Add Item</a>\
		<a class="prepend">Prepend Item</a>\
		<a class="render">Render View</a>',
	events: {
		'click .append': 'appendItem',
		'click .prepend': 'prependItem',
		'click .render': 'renderView',
		'click .delete': 'removeItem'
	},
	subSelector: '#mvp1 > ul',
	itemTemplate: '<li>{{name}}</li>'
});

