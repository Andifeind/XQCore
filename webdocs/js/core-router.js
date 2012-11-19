var CoreRouter = function(conf) {
	var CoreRouter,
		router ;

	CoreRouter = Backbone.Router.extend(conf);
	router = new CoreRouter();
	Backbone.history.start();
	return router;
};