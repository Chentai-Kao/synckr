
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var mongoose = require('mongoose');
var models = require('./models');

// Example route
// var user = require('./routes/user');
var events = require('./routes/events');
var fb = require('./routes/fb');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('mongoose', mongoose);
app.set('models', models);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
// Example route
// app.get('/users', user.list);
app.get('/', function(req, res) {res.redirect('/events');});
app.get('/login', fb.login);
app.get('/callback', fb.loginCallback);
app.get('/logout', fb.logout);
app.get('/events', events.listEvent);
app.post('/events', events.createEvent);
app.get('/events/new', events.createEventPage);
app.get('/events/:id', events.getEvent);
app.post('/events/:id', events.updateEvent)
app.post('/events/:id/slots', events.updateSlot);
app.get('/events/:id/heatmap', events.getHeatmap);
app.get('/events/:id/slots', events.getSlot);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// MongoDB
var mongo = require('mongodb');
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/synckr');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB opened');
});
