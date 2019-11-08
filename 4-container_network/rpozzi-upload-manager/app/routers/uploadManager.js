// Add required modules
var fs = require('fs-extra');
var multer = require('multer');
var propertyReader = require('../utils/propertyReader');
// Read environment variables
var uploadDir = process.env.UPLOAD_DIR;
// Setup multipart upload configuration
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

module.exports = function(app, logger) {
    app.get('/healthz', function(req, res) {
        logger.info("/healthz endpoint called");
        res.json({ response : 'UploadManager microservice is healthy !!!'});
    });
    app.get('/dir', function (req, res) {
        var msg = "Upload directory is: " + uploadDir;
        logger.info("/dir endpoint called");
        logger.info(msg);
        res.json({ response : msg });
    });
    app.get('/config', function (req, res) {
        logger.info("/config endpoint called");
        var response = '<html><head><meta charset="utf-8"><title>Restaurants</title><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1"></head>';
        response += '<body><h3>Configuration properties are: </h3>';
        var properties = propertyReader.getProperties();
        properties.forEach(element => {          
            response += '<br><i>' + element[0] + " = " + element[1] + '</i>';
        });
        response += '<br>';
        response += '<br><i>KeyStore Password = ' + process.env.KEYSTORE_PASSWORD + '</i>';
        response += '</body></html>';
        response += '</body></html>';
        res.send(response);
    });
    app.post('/upload', upload.array('fileToUpload'), function(req, res) {
        logger.info("/upload endpoint called");
        const files = req.files;
        if (files) {
            var uploadStatus = 'Files uploaded successfully to ' + uploadDir + ' directory';
            var sizeObj = { size : files.size };
            var messageObj = { message : uploadStatus };
            var filesObj = { files : files };
            res.json({ response : [sizeObj, messageObj, filesObj] });
        } else {
            var uploadStatus = 'File Upload Failed';
            logger.info(uploadStatus);
            res.json({ response : uploadStatus });
        }
    });
    app.get('/list', function (req, res) {
        var msg = "List files from " + uploadDir + " directory";
        logger.info("/list endpoint called");
        logger.info(msg);
        var count = 0;
        var fileList = [];
        fs.readdir(uploadDir, function (err, files) {
            if (err) {
                return logger.error(err);
            }
            files.forEach(function (file) {
                logger.info(file);
                fileList[count++] = file;
            });
            var sizeObj = { size : count };
            var messageObj = { message : msg };
            var filesObj = { files : fileList };
            res.json({ response : [sizeObj, messageObj, filesObj] });
        });
    });
    app.get('/delete', function (req, res) {
        logger.info("/delete endpoint called");
        logger.info("Delete files from " + uploadDir + " directory");
        // Delete directory content - Async with callbacks:
        fs.emptyDir(uploadDir, err => {
            if (err) 
                return console.error(err)
            var msg = "Files deleted from " + uploadDir + " directory";
            logger.info(msg);
            res.json({ response : msg });
        })
    });
};