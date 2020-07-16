const mongoose = require('mongoose');

module.exports = () => {
	mongoose.connect('mongodb+srv://vodenkaj:Sufix558@random-colors.trjbx.azure.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true});
}