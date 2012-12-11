/*globalmodel1,view1 */
var len = 0;

var presenter = new XQCore.Presenter({
	debug: true,
	viewInit: function(view) {
		if (view.name === 'FirstView') {
			//Add data to model1
			model1.append('items', {name: 'A'});
			model1.append('items', {name: 'B'});
			model1.append('items', {name: 'C'});
			model1.append('items', {name: 'D'});

			view1.render(model1.get());
		}
	},
	routes: {
		'default': 'preFill',
		'apple': function() {
			// this.pushState({page: 'a'}, 'Example A', '#!apple');
			model1.set({
				items: [
					{name: 'A'},
					{name: 'P'},
					{name: 'P'},
					{name: 'L'},
					{name: 'E'}
				]
			});

			view1.render(model1.get());
		},
		'banana': function() {
			// this.pushState({page: 'b'}, 'Example B', '#!banana');
			model1.set({
				items: [
					{name: 'B'},
					{name: 'A'},
					{name: 'N'},
					{name: 'A'},
					{name: 'N'},
					{name: 'A'}
				]
			});

			view1.render(model1.get());
		},
		'coconut': function() {
			// this.pushState({page: 'c'}, 'Example C', '#!coconut');
			model1.set({
				items: [
					{name: 'C'},
					{name: 'O'},
					{name: 'C'},
					{name: 'O'},
					{name: 'N'},
					{name: 'U'},
					{name: 'T'}
				]
			});

			view1.render(model1.get());
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
	},
	preFill: function() {
		model1.append('items', {name: 'E'});
		model1.append('items', {name: 'F'});
		
		view1.render(model1.get());
	}
});

var model1 = new XQCore.Model({
	debug: true,
	name: 'First',
	defaults: {
		items: [
			{name: '#'}
		]
	}
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

