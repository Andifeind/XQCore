var model = new XQCore.Model('example', function(self) {
    'use strict';

    self.schema = {
        title: { type: 'string', min: 3, max: 25, required: true },
        type: { type: 'string', min: 3, max: 25, required: true },
        description: { type: 'string', min: 3, max: 250, required: true }
    };

    /**
     * Override save method
     * @return {[type]} [description]
     */
    self.save = function(data) {
        console.log('SAVE DATA:', data);
    };
});

var presenter = new XQCore.Presenter('example', function(self) {
    'use strict';

    var view = self.initView('forms', 'body', {

    });

    self.couple({
        model: model,
        view: view,
        forms: true
    });
});

presenter.init();