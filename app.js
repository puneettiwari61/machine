var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash')
var session = require('express-session')
var middleware = require('./modules/middlewares')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admins')
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

//connect to database
mongoose.connect('mongodb://utstwpmgdpg4gqncciwx:DOVEBRXqfrXUqMhlDhx8@bqtwwtro06ugz3w-mongodb.services.clever-cloud.com:27017/bqtwwtro06ugz3w',{ useNewUrlParser: true, useUnifiedTopology: true },
(err) => {
console.log('connected', err?false:true)  
})
mongoose.set('useCreateIndex', true)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'ncdkdsjm',
  saveUninitialized: false,
  resave: true,
  store: new MongoStore({mongooseConnection: mongoose.connection})
  })
)

app.use(flash())
app.use(middleware.dateFormat)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admins', adminRouter)

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
