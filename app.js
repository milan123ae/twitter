var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');

var index = require('./routes/index');
var subscriber = require('./routes/subscriber');
var addsubscriber = require('./routes/addsubscriber');
var editsubscriber = require('./routes/editsubscriber');
var naslovna = require('./routes/naslovna');
var followers = require('./routes/followers');
var following = require('./routes/following');
var tweet = require('./routes/tweet');

var app = express();

var sess;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'ssshhhhh'}));
app.use('/', index);
app.use('/subscriber', subscriber);
app.use('/addsubscriber', addsubscriber);
app.use('/editsubscriber', editsubscriber);
app.use('/naslovna', naslovna);
app.use('/followers', followers);
app.use('/following', following);
app.use('/tweet', tweet);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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

module.exports = app;
