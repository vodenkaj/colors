const mongoose = require('mongoose');
const config = require('../config');

module.exports = () => {
	mongoose.connect('mongodb+srv://vodenkaj:config.MONGO_PASS@random-colors.trjbx.azure.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true});
}
