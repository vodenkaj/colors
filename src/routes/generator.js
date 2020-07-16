module.exports = (app) => {
	app.get('/generator', (req, res) =>{
		res.render('generator');
	});
}