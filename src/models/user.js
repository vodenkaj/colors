const mongoose = require('mongoose');
const { validationResult } = require('express-validator')

const userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
})

exports.validate = async (req, method) => {
	switch(method){
		case 'signup':
			return validationResult(req).isEmpty()
				&& Object.keys(await user.find({email: req.body.email}).exec()).length == 0
		case 'signin':
			return validationResult(req).isEmpty();
	}
}
const user = mongoose.model('User', userSchema);
exports.model = mongoose.model('User', userSchema);
