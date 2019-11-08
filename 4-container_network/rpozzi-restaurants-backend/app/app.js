// Add required modules
var express = require('express');
var timeout = require('connect-timeout');
var logger = require('./utils/logger');
// Initialize application
var app = express();
app.use(express.static(process.cwd() + '/public'));
app.use(errorHandler);
app.use(timeout(5000));
app.use(haltOnTimedout);
// Variables section
var PORT = 8082;
// Routers setup
require("./routers/restaurant")(app, logger);
// Run server
app.listen(PORT, function() {
	var propertyReader = require('./utils/propertyReader');
	try {
		var useDb = propertyReader.getProperty('use.db');
		logger.info("use.db = " + useDb);
		if (useDb) {
			logger.info("DB Type = " + propertyReader.getProperty('db.type'));
			logger.info("DB Url = " + propertyReader.getProperty('db.url'));
			logger.info("DB Port = " + propertyReader.getProperty('db.port'));
			logger.info("DB Name = " + propertyReader.getProperty('db.dbname'));
			logger.info("DB Username = " + propertyReader.getProperty('db.username'));
			logger.info("DB Password = " + propertyReader.getProperty('db.password'));
		}
	} catch (error) {
		logger.error("Not able to read 'use.db' property");
	}
	logger.info("Application is listening on port " + (process.env.EXPOSED_PORT || PORT));
});
// ############ Common Functions
// Halt timeout
function haltOnTimedout(req, res, next){
	if (!req.timedout) next();
}
// Error Handling
function errorHandler (err, req, res, next) {
	if (res.headersSent) {
	  return next(err)
	}
	logger.error("Error : " + err);
	res.status(500);
	//res.render('error.html', { error: err });
	res.sendFile('error.html', {root : process.cwd() + '/public'});
}