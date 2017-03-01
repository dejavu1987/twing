var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//
 app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080);
 app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

var server = http.Server(app);
var io = require('socket.io')(server);
var twing = require('./modules/twing');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


io.sockets.on('connection', function (socket){twing.socketOnConnectionCallback(io,socket)});


server.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002, process.env.OPENSHIFT_NODEJS_IP || "127.9.201.1");

module.exports = app;
