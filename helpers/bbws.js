var superagent = require('superagent'),
    Promise = require('bluebird'),
    config = rootRequire('helpers/config');

require('superagent-bluebird-promise');

bbws = {};

var _processError = function(response) {
	var newErr;

	var requestPath = response.error.method + ': ' + response.error.path;

	switch (response.status) {
		case 401:
			newErr = new Error('Not Authorized (' + requestPath + ')');
			break;
		case 404:
			newErr = new Error('Not Found (' + requestPath + ')');
			break;
		case 411:
			newErr = new Error('Length Required (' + requestPath + ')');
			break;
		default:
			newErr = new Error('Unknown Error (' + requestPath + ')');
	}

	newErr.status = response.status;

	throw newErr;
};

bbws.get = function(path, options) {
	options = options || {};

	if (path.charAt(0) === '/')
		path = config.site.webservice + path;

	var request = superagent.get(path)
		.accept('application/json');

  if (options.accessToken)
    request = request.set('Authorization', 'Bearer ' + options.accessToken);

	return request
		.promise()
		.then(function(response) {
			return response.body;
		})
		.catch(_processError);
};

bbws.post = function(path, data, options) {
	options = options || {};

	if (path.charAt(0) === '/')
		path = config.site.webservice + path;

	var request = superagent.post(path);

	if (options.accessToken)
		request = request.set('Authorization', 'Bearer ' + options.accessToken);

	if (!data)
		data = {};

	return request
		.send(data)
		.promise()
		.then(function(response) {
			return response.body;
		})
		.catch(_processError);
};

module.exports = bbws;