
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')
var mongoose = require('mongoose');
var models = require('./models')

// Example route
// var user = require('./routes/user');
var index = require('./routes/index');
var project = require('./routes/project');
var newevent = require('./routes/newevent');
var getevent = require('./routes/getevent');
var eventlist = require('./routes/eventlist');

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
app.get('/', index.view);
app.get('/project/:name', project.viewProject);
app.get('/getevent/:eventId', getevent.get);
app.get('/eventlist/:facebookId', eventlist.get);
app.post('/newevent', newevent.create);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// MongoDB
mongoose.connect('mongodb://localhost/synckr');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB opened');
});
