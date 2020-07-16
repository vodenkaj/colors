module.exports = (app) => {
	app.get('*', (req, res) =>{
		res.status(404);
		res.render('htmlStatus', {errorCode: '404', errorMessage: 'Page not found'});
	});
}