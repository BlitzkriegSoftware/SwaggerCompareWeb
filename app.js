var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var request = require('request');
var swaggerDiff = require('swagger-diff');
var formatjson = require('format-json');
var debug = require('debug')('sdiff:server');
var http = require('http');

// Variable deployPath is set in web.config and must match
// the path of app.js in virtual directory.
// If app.js is run from command line:
//   "C:/tssapp-deploy/tsappsvr/TestExpress/0.0.0> node app.js"
// deployPath is set to empty string.
var deployPath = process.env.deployPath || "";

var port = process.env.PORT || '8080';

var app = express();

app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));

// Add this after the bodyParser middlewares!
app.use(expressValidator());

app.use(cookieParser());

app.use(deployPath + "/public", express.static(path.join(__dirname, 'public')));

app.route('/').get(function(req, res, next) {
    res.render('index', { title: 'Swagger Diff Web' });
});

app.route('/compare').post(function(req, res, next) {

    var url1 = req.body.url1;
    var url2 = req.body.url2;
    var spec1 = '';
    var spec2 = '';

    request.get(url1, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            spec1 = JSON.parse(body);

            request.get(url2, function(err, response, body) {
                if (!err && response.statusCode == 200) {
                    spec2 = JSON.parse(body);

                    // https://www.npmjs.com/package/swagger-diff
                    var config = '{ "changes": { "breaks": 3, "smooths": 2 } }';

                    swaggerDiff(spec1, spec2, config).then(function(diff) {
                        res.type('json');
                        res.send(formatjson.diffy(diff));
                    });
                }
            });
        }
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found: ' + req.originalUrl);
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var server = http.createServer(app);
server.listen(port);
console.log('Application has started at location ' + port);
