const mongoose = require('mongoose');
const config = require('../config');

module.exports = () => {
	mongoose.connect(`mongodb+srv://${config.MONGO_NAME}:${config.MONGO_PASS}@${config.DB_NAME}.trjbx.azure.mongodb.net/`, {useNewUrlParser: true, useUnifiedTopology: true});
}
