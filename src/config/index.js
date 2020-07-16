const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	port: process.env.PORT,
	api: {
		prefix: '/api',
	},
	SESS_LIFETIME: 900000,
	SESS_SECRET: process.env.SECRET,
};