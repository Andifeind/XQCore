$(function() {

	XQCore.html5Routes = false;

	var presenter = new XQCore.Presenter({
		debug: true,
		name: 'history',
		root: '/examples/',
		events: {
			linkClick: function(e) {
				var id = e.target.id,
					num = e.target.id.replace(/^.+(\d+)$/, '$1');

				e.preventDefault();

				console.log(id, num, e.target.id, this, e.target,e);
				this.pushState({
					page: id
				}, 'Test ' + num,'#!test' + num + '.html');
				this['link' + num]();
			}
		},
		routes: {
			'test1.html': 'link1',
			'test2.html': 'link2',
			'test3.html': 'link3',
			'test4.html': 'link4',
			'test5.html': 'link5'
		},
		link1: function() {
			view.update({
				text: 'link1 was clicked'
			});
		},
		link2: function() {
			view.update({
				text: 'link2 was clicked'
			});
		},
		link3: function() {
			view.update({
				text: 'link3 was clicked'
			});
		},
		link4: function() {
			view.update({
				text: 'link4 was clicked'
			});
		},
		link5: function() {
			view.update({
				text: 'link5 was clicked'
			});
		}
	});

	var view = new XQCore.View({
		debug: true,
		name: 'history',
		container: 'body',
		events: {
			'click a': 'linkClick'
		},
		update: function(data) {
			$('#out').html(data.text);
		}
	});

	presenter.init(view);

});