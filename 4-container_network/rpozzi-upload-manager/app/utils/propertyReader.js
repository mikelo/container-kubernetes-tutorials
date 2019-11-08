var propertiesReader = require('properties-reader');
var logger = require('./logger');
logger.info("Current working directory = " + process.cwd());
logger.info("Upload directory from UPLOAD_DIR environment variable = " + process.env.UPLOAD_DIR);
// Variables section
var configDir = (process.env.CONFIG_DIR || (process.cwd() + '/config'));
if (process.env.CONFIG_DIR == undefined) {
	logger.info("No CONFIG_DIR environment variable has been defined");
	logger.info("Configuration files directory from Current Working Dir = " + configDir);
} else {
	logger.info("Configuration files directory from CONFIG_DIR environment variable = " + configDir);
}
var properties;
var propertiesArray;
try {
	properties = propertiesReader(configDir + '/config.properties');
	propertiesArray = Object.entries(properties._properties);
} catch (error) {
	logger.error("Not able to read from " + configDir + "/config.properties - check whether the file exists");
}
// Functions
function getProperty(key) {
	return properties.get(key);
}
function getProperties() {
	return propertiesArray;
}

exports.getProperty = getProperty;
exports.getProperties = getProperties;