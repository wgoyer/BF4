var MongoClient = require('mongodb').MongoClient;
var query = {};
var projection = {"player":1, "stats" : 1};
var sorter = {"player.dateUpdate": -1};
var cursor;

function player(name){
	this.name = name;
	this.score = 0;
	this.timePlayed = 0;
	this.skill = 0;
	this.kills = 0;
	this.deaths = 0;
	this.kdr = 0;
	this.headShots = 0;
	this.roundsWon = 0;
	this.roundsLost = 0;
	this.rankImage = "bf4/ranks/r0.png";
}

exports.index = function(req,res){
	createUsers(function(sj, bs, ndn, cp){
		res.render('index', {sj: sj, ndn: ndn, bs: bs, cp: cp});
	});
};

function createUsers(callback){
	var sweetJesus = new player("Sweet-Jeezus");
	var ndn = new player("A_Hostile_NdN");
	var bside = new player("bsidedemo");
	var bronco = new player("cpbronco");
	var users = [sweetJesus, ndn, bside, bronco];
	loadUserDataRecurse(users, 0, function(){
		callback(sweetJesus, ndn, bside, bronco);
	});
}

function loadUserDataRecurse(users, count, callback){
	if(users.length === count){
		callback();
	} else {
		MongoClient.connect('mongodb://localhost:27017/test', function(err, db){
			if(err) throw err;
			var resultArray = [];
			query = {"player.name":users[count].name};
			db.collection('bf4_back').find(query).sort(sorter).limit(1).toArray(function(err, doc){
				console.log(doc[0].player.dateUpdate + " "+ doc[0].player.name);
				if(err) throw err;
				users[count].score = doc[0].player.score;
				users[count].timePlayed = doc[0].player.timePlayed;
				users[count].skill = doc[0].stats.skill;
				users[count].kills = doc[0].stats.kills;
				users[count].deaths = doc[0].stats.deaths;
				users[count].kdr = doc[0].stats.extra.kdr.toFixed(2);
				users[count].headShots = doc[0].stats.headshots;
				users[count].rankImage = doc[0].player.rank.imgLarge;
				return loadUserDataRecurse(users, count+1, callback);
			});
		});
	}
}