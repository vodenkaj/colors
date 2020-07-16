const mongoose = require('mongoose');

const palleteSchema = mongoose.Schema({
	colors: [[String, String]]
});


module.exports = mongoose.model('Pallete', palleteSchema);