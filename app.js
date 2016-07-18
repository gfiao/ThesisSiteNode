var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


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


module.exports = app;


var Connection = require('tedious').Connection;
var config = {
    userName: 'gfiao',
    password: 'Leonardogui1.',
    server: 'sharedemotions.database.windows.net',
    // If you are on Microsoft Azure, you need this:
    options: {encrypt: true, database: 'emotions'}
};
var connection = new Connection(config);
connection.on('connect', function (err) {
    // If no error, then good to proceed.
    console.log("Connected");
    // logEmotions('anger');
    // queryDB();
});

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

function queryDB() {
    request = new Request("select * from shared_emotions", function (err) {
        if (err) {
            console.log(err);
        }
    });
    var result = "";
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    request.on('done', function (rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}

function logEmotions(emotion, timestamp) {
    request = new Request("insert shared_emotions(emotion, timestamp) values (@emotion, @timestamp);", function (err) {
        if (err) {
            console.log(err);
        }
    });

    request.addParameter('emotion', TYPES.NVarChar, emotion);
    request.addParameter('timestamp', TYPES.Int, timestamp);
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                console.log("Product id of inserted item is " + column.value);
            }
        });
    });
    connection.execSql(request);
}

// var io = require('socket.io').listen(80); // initiate socket.io server
// io.sockets.on('connection', function (socket) {
//     socket.emit('news', {hello: 'world'}); // Send data to client
//
//     // wait for the event raised by the client
//     socket.on('my other event', function (data) {
//
//         console.log(data);
//         logEmotions(data[0], data[1]);
//     });
// });