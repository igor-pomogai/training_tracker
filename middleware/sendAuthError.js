module.exports = function(req, res, next) {
	
	res.sendAuthError = function(error) {
		res.status(error.status);

		console.log(req.headers);
		if (req.headers['x-requested-with'] == 'XMLHttpRequest') {
			res.json(error);
		} else {
			//res.json(error);
			res.render("authError", {error: error});
		}
	};

	next();
};