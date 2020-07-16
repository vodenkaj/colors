const generator = require('./generator'),
	home = require('./home'),
	palletes = require('./palletes'),
	ajax = require('./api/ajax'),
	auth = require('./auth'),
	errors = require('./errors');

module.exports = (express) => {
	const router = express.Router();

	generator(router);
	home(router);
	palletes(router);
	ajax(router);
	auth(router);
	errors(router);

	return router;
}