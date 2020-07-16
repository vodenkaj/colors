const mongoose = require('mongoose');
const User = require('../models/user')

module.exports = (app) => {
	app.post('/signup', async (req, res) => {
		const user = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		});

		try{
			const savedUser = await user.save();
			res.send(savedUser);
		}
		catch (err){
			res.status(400).send(err);
		}
	});

	app.post('/signin', async (req, res) =>{
		//TODO: Validate
		let loggedUser;
		try{
			loggedUser = await User.find({ email: req.body.email }, 'password name').exec();
			if (loggedUser[0].password != req.body.password) throw new Error('Not found');
			req.session.userId = loggedUser[0]._id;
			req.session.user = loggedUser[0].name;
			res.redirect('/');
		}
		catch (err){
			res.status(400).send(err);
		}
	})
};