const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const callbackRouter = require('./routes/callback');
const refreshTokenRouter = require('./routes/refresh_token');
const searchRouter = require('./routes/search');
const releasesRouter = require('./routes/releases');
const albumsRouter = require('./routes/albums');
const tracksRouter = require('./routes/tracks');

const app = express();

const CODE_NOT_FOUND = 404;
const CODE_ERROR = 500;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/callback', callbackRouter);
app.use('/refresh_token', refreshTokenRouter);
app.use('/search', searchRouter);
app.use('/releases', releasesRouter);
app.use('/albums', albumsRouter);
app.use('/tracks', tracksRouter);
app.set('view engine', 'pug');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(CODE_NOT_FOUND));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || CODE_ERROR);
  res.render('error');
});

module.exports = app;
