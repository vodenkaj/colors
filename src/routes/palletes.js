const express = require('express');
const Pallete = require('../models/pallete');

module.exports = (app) => {
	
	app.get('/palletes', (req, res) =>{
		res.render('palletes');
	});

	app.post('/save', (req, res, next) =>{
		if (!req.session.userId || req.body.name.length < 1) return res.render('htmlStatus', {errorCode: '403', errorMessage: 'Forbidden'});
		next();
	})

	app.post('/save', express.json(), async (req, res) => {
		const colors = []

		JSON.parse(req.body.data).forEach((hex)=>{
			colors.push([hex, true]);
		})
		
		const userPallete = new Pallete({
			colors: colors
		})
		const response = await userPallete.save();
		res.send(response);
	})
}