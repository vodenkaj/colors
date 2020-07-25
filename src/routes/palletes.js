const express = require('express');
const Pallete = require('../models/pallete');
const errors = require('./errors')

module.exports = (app) => {
	
	app.get('/palletes', (req, res) =>{
		res.render('palletes');
	});

	app.post('/save', (req, res, next) =>{
		if (!req.session.userId || req.body.name.length < 1) return errors.forbidden(res);
		next();
	})

	app.post('/save', express.json(), async (req, res) => {
		const colors = []

		try{
			JSON.parse(req.body.data).forEach((hex)=>{
			if (!hex[0].trim().match(/^[#A-Z0-9]*$/)) throw new Error('Invalid character!')
				colors.push([hex[0], hex[1]]);
			})
			
			const userPallete = new Pallete({
				colors: colors,
				creator: req.session.user
			})
			const response = await userPallete.save();
			res.send(response);
		}
		catch(err){
			return errors.invalidData(res);
		}
	})
}