// Add required modules
var express = require('express');
var timeout = require('connect-timeout');
const cors = require('cors');
var logger = require('./utils/logger');
// Initialize application
var app = express();
app.use(cors());
app.use(errorHandler);
app.use(timeout(5000));
app.use(haltOnTimedout);
// Variables section
var PORT = 8083;
// Routers setup
require("./routers/uploadManager")(app, logger);
// Run server
app.listen(PORT, function() {
	logger.info("Current working directory = " + process.cwd());
	logger.info("Upload directory from UPLOAD_DIR environment variable = " + process.env.UPLOAD_DIR);
	// START - KEYSTORE_PASSWORD
	var keystorePassword = process.env.KEYSTORE_PASSWORD;
	if (keystorePassword == undefined) {
		logger.info("No KEYSTORE_PASSWORD environment variable has been defined");
	} else {
		logger.info("KEYSTORE_PASSWORD environment variable is set to = " + keystorePassword);
	}
	// END - KEYSTORE_PASSWORD
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