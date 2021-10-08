var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose = require("mongoose");
var app = express();



//adding mongo
const mongoDB = process.env.MONGO_URL || "mongodb://localhost:27017/testdb";
//connecting to db
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
//mongo error handling
db.on("err", console.error.bind(console, "MongoDb connection error"));

//https://stackoverflow.com/questions/24800511/express-js-form-data
/*const formData = require("express-form-data");
app.use(formData.parse());*/

const fileParser = require("express-multipart-file-parser");
app.use(fileParser);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

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
    res.sendStatus(err.status || 500);
    //res.send(err.status);

});




module.exports = app;