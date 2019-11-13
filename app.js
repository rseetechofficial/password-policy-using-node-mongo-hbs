var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();
// const expressValidator = require('express-validator');
var mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
var session = require('express-session');
app.use(session({secret: '12322223', saveUninitialized: false, resave: false}));
// app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

//mongodb connection start
mongoose.connect("mongodb://localhost/rodeoTravel",{ useNewUrlParser: true, useUnifiedTopology : true },  function(err){
  if(err){
      console.log('The error is ',err)
  }
  else{
  console.log('The database connected')
  }
})
//mongodb connection end

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
app.use('/', router);
module.exports = app;
