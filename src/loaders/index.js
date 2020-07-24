const expressLoader = require('./express');
const mongooseLoader=  require('./mongoose');
module.exports = async (expressApp) => {
	await mongooseLoader();
	console.log('MongoDB Loaded');
	await expressLoader(expressApp);
	console.log('Express Loaded');
}
