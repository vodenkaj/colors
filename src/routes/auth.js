const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user')
const errors = require('./errors')
const { check } = require('express-validator');

module.exports = (app) => {
	app.post('/signup', [
		check('name').trim().escape().exists().notEmpty(), 
		check('email').isEmail().normalizeEmail().exists().notEmpty(),
		check('password').exists().notEmpty()], async (req, res) => {
		if (!await User.validate(req, 'signup')) return errors.invalidData(res);

		const user = new User.model({
			name:req.body.name,
			email: req.body.email,
			password: await bcrypt.hash(req.body.password, 10) 
		});
		try{
			const savedUser = await user.save();
			res.redirect(req.session.lastUrl != 'undefined' ? req.session.lastUrl : '/');
		}
		catch (err){
			errors.badRequest(res);
		}
	});

	app.post('/signin', [
		check('email').isEmail().normalizeEmail().notEmpty(),
		check('password').notEmpty()], async (req, res) =>{
		try{
			if (!await User.validate(req, 'signin')) throw new Error();
			const loggedUser = await User.model.find({ email: req.body.email }, 'password name').exec();
			if (await bcrypt.compare(req.body.password, loggedUser[0].password) == false) throw new Error();
			req.session.userId = loggedUser[0]._id;
			req.session.user = loggedUser[0].name;
			res.redirect(req.session.lastUrl != 'undefined' ? req.session.lastUrl : '/');
		}
		catch(err){
			return errors.invalidData(res);
		}
	})
};