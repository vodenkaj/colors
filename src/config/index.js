const path = require('path');
const dotenv = require('dotenv').config({path:__dirname+'\\..\\.env'});

console.log({path:__dirname+'.env'});
module.exports = {
	port: process.env.PORT,
	api: {
		prefix: '/api',
	},
	SESS_LIFETIME: 900000,
	SESS_SECRET: process.env.SECRET,
	MONGO_PASS: process.env.MONGO_PASS,
	MONGO_NAME: process.env.MOONGO_NAME,
};