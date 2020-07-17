const express = require('express');
const config = require('./config/index.js');
const loaders = require('./loaders');

async function startServer(){
	const app = express();
	await loaders(app);
	
	app.set('view engine', 'ejs');

	app.listen(config.port, err => {
		if (err){
			console.log(err);
			return;
		}
		console.log(process.env.PORT);
		console.log(`Server listening on port: ${config.port}`);
	});

}

startServer();
