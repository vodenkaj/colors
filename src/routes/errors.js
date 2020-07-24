exports.badRequest = (res) => {
	return res.status(400).render('html_status', {errorCode: 400, errorMessage: 'Bad Request'})
}

exports.notFound = (res) => {
	return res.status(404).render('html_status', {errorCode: 404, errorMessage: 'Page not found'});
}

exports.forbidden = (res) => {
	return res.status(403).render('html_status', {errorCode: 403, errorMessage: 'Forbidden'});
}

exports.invalidData = (res) => {
	return res.status(422).render('html_status', {errorCode: 422, errorMessage: 'Invalid Data'});
}