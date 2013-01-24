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
				if (num === '4') {
					this.replaceState({
						page: id
					}, 'Test ' + num,'#!test' + num + '.html');
				}
				else {
					this.pushState({
						page: id
					}, 'Test ' + num,'#!test' + num + '.html');
				}
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
				text: 'link1 was clicked',
				num: 1
			});
		},
		link2: function() {
			view.update({
				text: 'link2 was clicked',
				num: 2
			});
		},
		link3: function() {
			view.update({
				text: 'link3 was clicked',
				num: 3
			});
		},
		link4: function() {
			view.update({
				text: 'link4 was clicked',
				num: 4
			});
		},
		link5: function() {
			view.update({
				text: 'link5 was clicked',
				num: 5
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
			document.title = 'Example ' + data.num;
			$('#out').html(data.text);
		}
	});

	presenter.init(view);

});