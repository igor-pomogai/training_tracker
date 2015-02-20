exports.get = function(req, res) {
	if (req.session.user) {
		res.redirect('/personal');
	} else {
		res.render('frontpage');	
	}
};