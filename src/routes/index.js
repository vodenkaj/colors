const generator = require('./generator'),
	home = require('./home'),
	palletes = require('./palletes'),
	ajax = require('./api/ajax'),
	auth = require('./auth'),
	errors = require('./errors'),
	profile = require('./profile')

module.exports = (express) => {
	const router = express.Router();

	generator(router);
	home(router);
	palletes(router);
	ajax(router);
	auth(router);
	profile(router);

	router.get('*', (req, res) =>{
		const url = req.url.slice(1).replace(/-/g, '').toUpperCase();
		if (url.length % 2 != 0 || !url.match(/^[A-Z0-9]*$/)) return errors.notFound(res);
		res.render('generator');
	});

	return router;
}