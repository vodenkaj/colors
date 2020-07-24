const path = require('path');
const dotenv = require('dotenv').config({path:__dirname+'\\..\\.env'});

module.exports = {
	port: process.env.PORT,
	SESS_LIFETIME: 900000,
	SESS_SECRET: process.env.SECRET,
	MONGO_PASS: process.env.MONGO_PASS,
	MONGO_NAME: process.env.MOONGO_NAME,
	DB_NAME: process.env.DB_NAME
};