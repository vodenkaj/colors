const express = require('express');
const routes = require('../routes');
const config = require('../config');
const session = require('express-session')

module.exports = (app) => {

	app.get('/status', (req, res) => { res.status(200).end(); });
	app.head('/status', (req, res) => { res.status(200).end(); });
	app.enable('trust proxy');

	app.use(session({
		name: 'sid',
		resave: false,
		saveUninitialized: false,
		secret: config.SESS_SECRET,
		cookie: {
			maxAge: config.SESS_LIFETIME,
			sameSite: true,
			secure: false,
		}
	}))
	app.disable('x-powered-by');
	app.disable('etag');

	app.use(express.urlencoded({extended: true}));
	app.use((req, res, next) => {
		res.header('x-xss-protection', '0;mode=block');
		res.header('Referrer-Policy', 'no-referrer');
		res.header('cache-control', 'no-store, no-cache, must-revalidate');
		next();
	})

	app.use(express.static('public'));

	app.use((req, res, next) =>{
		if (req.session.user) res.locals.user = req.session.user;
		next();
	})

	app.use(routes(express));
};