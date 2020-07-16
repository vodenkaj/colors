const expressLoader = require('./express');
const mongooseLoader=  require('./mongoose');
module.exports = async (expressApp) => {
	const mongoConnection = await mongooseLoader();
	console.log('MongoDB Loaded');
	await expressLoader(expressApp);
	console.log('Express Loaded');
}
