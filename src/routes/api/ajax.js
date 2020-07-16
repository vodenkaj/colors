const express = require('express');
const Pallete = require('../../models/pallete');

module.exports = (app) => {
	app.post('/ajax/pallete-list', express.json(), async (req, res) =>{
		if (req.session.userId) {
			res.status(403);
			return res.render('htmlStatus', {errorCode: 403, errorMessage: 'Forbidden'})
		}
		let page = req.body.page;
		const colors = await Pallete.find({}, 'colors').skip(page*100).limit(100);
		const pallete = colors.map((color) => {
			return color.colors;
		})

		res.send(pallete);
	})
}