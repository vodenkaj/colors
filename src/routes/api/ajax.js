const express = require('express');
const errors = require('../errors');
const Pallete = require('../../models/pallete');

module.exports = (app) => {
	app.post('/ajax/pallete-list', express.json(), async (req, res) =>{

		let page = req.body.page;
		const colors = await Pallete.find({}, 'colors').skip(page*100).limit(100);
		const pallete = colors.map((color) => {
			return color.colors;
		})

		res.send(pallete);
	})

	app.get('/ajax/user-palletes', async (req, res) => {
		const colors = await Pallete.find({creator: req.session.user}, 'colors');
		const pallete = colors.map((color) => {
			return color.colors;
		})

		res.send(pallete);
	});
}