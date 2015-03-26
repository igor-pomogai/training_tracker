var User = require('models/user').User;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	if (req.session.user) {
		res.redirect('/personal');
	} else {
		//createAdmin(res);
		res.render('frontpage');	
	}
};

function createAdmin(res) {
	var user = new User({
		username: 'dayaram',
		firstname: 'Igor',
		lastname: 'Pomogai',
		email: 'pomogai92@gmail.com',
		password: '6tfCVgy7',
		birthDate: new Date(1992, 2, 16),
		approved: true
	});

	user.userGroup.push({
		name: 'admin'
	});

	user.userGroup.push({
		name: 'user'
	});

	user.save(function(err) {
		if (err) console.log(err);

		log.info('Admin created!');

		res.render('frontpage');
	});
}