var renderPresenter,
	renderModel,
	renderView;

$(function() {
	renderPresenter = new XQCore.Presenter({
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

	renderModel = new XQCore.Model({
		debug: true,
		name: 'Render'
	});

	renderView = new XQCore.View(renderPresenter, {
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