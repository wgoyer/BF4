var express = require('express')
, path = require('path')
, index = require('./routes/index.js')
, logStats = require('./routes/logData.js')
, routes = require('./routes')

var app = express();

app.configure(function(){
	app.set('views', __dirname+'/views');
	app.set('view engine', 'jade');
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.static('public'));
});

app.get('/', index.index);

app.get('/public/*', function(req, res){
  res.sendfile(__dirname + req.url);
});

// app.post('/updateStats', function(req, res){
// 	logStats.logData(function(){
// 		res.send('done');
// 	});
// });

app.post('/updateStats/:userName', function(req, res){
	var userName = req.params.userName;
	logStats.getSingleUser(userName, function(user){
		logStats.logStatsForUser(user, function(){
			logStats.getStatsForUser(user, function(){
				console.log(user);
				res.send(user);
			});
		});
	});
});

app.get("*", function(req, res) {
	res.send("Page not found.", 404);
});

app.listen(8080);
console.log("Started on 8080");
