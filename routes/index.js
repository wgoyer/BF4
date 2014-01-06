var MongoClient = require('mongodb').MongoClient;
var query = {};
var projection = {"player":1, "stats" : 1};
var sorter = {"dateUpdated": -1};
var playerArray = [];

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
	this.twitchID = "";
}

exports.index = function(req,res){
	createUsers(function(sj, bs, ndn, cp, sd){
		playerArray = [sj, bs, ndn, cp, sd];
		res.render('index', {playerArray: playerArray});
	});
};

function createUsers(callback){
	var sweetJesus = new player("Sweet-Jeezus");
	var ndn = new player("A_Hostile_NdN");
	var bside = new player("bsidedemo");
	var bronco = new player("cpbronco");
	var skidawg = new player("E5skiDAWG");
	var users = [sweetJesus, ndn, bside, bronco, skidawg];
	loadUserDataRecurse(users, 0, function(){
		callback(sweetJesus, ndn, bside, bronco, skidawg);
	});
}

function loadUserDataRecurse(users, count, callback){
	var timePlayed;
	if(users.length === count){
		callback();
	} else {
		MongoClient.connect('mongodb://localhost:27017/test', function(err, db){
			if(err) throw err;
			var resultArray = [];
			query = {"userName":users[count].name};
			db.collection('bf4').find(query).sort(sorter).limit(1).toArray(function(err, doc){
				var stats = doc[0].data.generalStats;
				if (stats.timePlayed > 1){
					timePlayed = (stats.timePlayed / 60 / 60).toFixed(2);
				}
				else {
					timePlayed = "N/A";
				}
				if(err) throw err;
				users[count].timePlayed = timePlayed;
				users[count].score = stats.score;
				users[count].skill = stats.skill;
				users[count].kills = stats.kills;
				users[count].deaths = stats.deaths;
				users[count].kdr = stats.kdRatio.toFixed(2);
				users[count].headShots = stats.headshots;
				users[count].rankImage = "bf4\\ranks\\r"+stats.rank+".png";
				users[count].twitchID = doc[0].twitchID;
				return loadUserDataRecurse(users, count+1, callback);
			});
		});
	}
}