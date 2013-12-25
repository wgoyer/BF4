var express = require('express')
, path = require('path')
, index = require('./routes/index.js')
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

app.get('/public/*', function(req,res){
  res.sendfile(__dirname + req.url);
});

// app.post('/createDefects', defects.createDefect);

app.get("*", function(req,res) {
	res.send("Page not found.", 404);
});

app.listen(8080);
console.log("Started on 8080");
