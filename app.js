var express      = require('express');
var app          = express();
var path         = require('path');
var port         = process.env.PORT || 8080;
//var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
//var flash        = require('connect-flash');
var mongoose     = require('mongoose');
var passport     = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

var configDB     = require('./config/database');

var users       = require('./routes/users');
var items        = require('./routes/items');    


// Connecting the MongoDB Database (HC) & Passport--------------------------------------------------------------------------------

mongoose.connect(configDB.url);
var db = mongoose.connection;

db.on('error', function(err){
    console.log('Mongoose COnnection Error: ' + err);
});

db.once('open', function(){
    console.log("Connected to MongoDB Successfully");
})

//require('./config/passport')(passport);                            // pass passport for configuration


// Setup Express Application ==========================================================================================
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Passport Setup =====================================================================================================

var User = require('./models/user');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());    


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// Defining the Routes ================================================================================================ 

app.use('/', users);
app.use('/items', items);
/*require('./routes/profiles')(app,passport);
require('./routes/items')(app, passport);
require('./routes/orders')(app,passport);
require('./routes/feedbacks')(app, passport);
//require('./routes/offers')(app,passport);*/



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log(req);
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


// Launch =====================================================================================

app.listen(port);
console.log("magic happens at port : " + port);
