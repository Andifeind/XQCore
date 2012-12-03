var renderPresenter,
	renderModel,
	renderView;

$(function() {
	renderPresenter = new CorePresenter({
		debug: true,
		name: 'Render',
		viewInit: function(view) {
			console.log(view.name, view);
			view.render({
				title: 'Render Test',
				content: 'Lorem ipsum ut in magna cillum qui do ut consectetur culpa sint minim dolor quis eu labore est ex deserunt sunt dolore ullamco. ',
				listing: [
					{color: 'Blue'},
					{color: 'Green'},
					{color: 'Yellow'},
					{color: 'Red'},
					{color: 'Purple'}
				]
			});
		}
	});

	renderModel = new CoreModel({
		debug: true,
		name: 'Render'
	});

	renderView = new CoreView(renderPresenter, {
		debug: true,
		name: 'Render',
		container: '#render-container',
		template: '<ul>\
			{{#each listing}}\
				<li>{{color}}\
			{{/each}}\
			'
	});
});