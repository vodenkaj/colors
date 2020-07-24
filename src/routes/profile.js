const errors = require('./errors');
module.exports = (app) => {
	app.get('/profile', (req, res) => {
		if (typeof req.session.userId == 'undefined') return errors.forbidden(res);
		res.render('profile');
	})
}