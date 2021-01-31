
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cors=require('cors')
const path = require("path");
var bodyParser=require('body-parser')
var billsRouter = require("./routes/bills-route");

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json({extended:false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use('/bills', billsRouter);

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

module.exports = app;
