var MongoClient = require('mongodb').MongoClient;
var request = require('request');
//Users - Move to DB at some point, create a form online users can use to create their own card.
var SweetJeezus = {
	name: "Sweet-Jeezus",
	ID: "935235828",
	twitchID: "sweet_jeezus"
};
var bsidedemo = {
	name: "bsidedemo",
	ID: "939582412",
	twitchID: "bsidedemo"
};
var cpbronco = {
	name: "cpbronco",
	ID: "271431564",
	twitchID: "cpbronco"
};
var A_Hostile_NdN = {
	name: "A_Hostile_NdN",
	ID: "890563396",
	twitchID: "ahostilendn"
};
var E5skiDAWG = {
	name: "E5skiDAWG",
	ID: "945896447",
	twitchID: "e5skidawg"
};
var users = [SweetJeezus, bsidedemo, cpbronco, A_Hostile_NdN, E5skiDAWG];

logStatsForUser = function(user, callback){
	var userURI = "http://battlelog.battlefield.com/bf4/warsawdetailedstatspopulate/"+user.ID+"/32/";
	MongoClient.connect('mongodb://localhost:27017/test', function(err, db){
		if(err) throw err;
		request(userURI, function(error, response, body){
			if(!error && response.statusCode == 200){
				var stats = JSON.parse(body);
				stats['dateUpdated'] = new Date();
				stats['userName'] = user.name;
				stats['twitchID'] = user.twitchID;
				console.log(stats.dateUpdated);
				db.collection('bf4').insert(stats, function(err,data){
					if(err) throw err;
					db.close();
					if (callback) callback();
				});
			}
		});
	});
};

getStatsForUser = function(user, callback){
	var query = {"userName" : user.name};
	var projection = {"player":1, "stats" : 1};
	var sorter = {"dateUpdated": -1};
	MongoClient.connect('mongodb://localhost:27017/test', function(err, db){
		if(err) throw err;
		db.collection('bf4').find(query).sort(sorter).limit(1).toArray(function(err, doc){
			var stats = doc[0].data.generalStats;
			if (stats.timePlayed > 1){
				timePlayed = (stats.timePlayed / 60 / 60).toFixed(2);
			}
			else {
				timePlayed = "N/A";
			}
			if(err) throw err;
			user.timePlayed = timePlayed;
			user.score = stats.score;
			user.skill = stats.skill;
			user.kills = stats.kills;
			user.deaths = stats.deaths;
			user.kdr = stats.kdRatio.toFixed(2);
			user.headShots = stats.headshots;
			user.rankImage = "bf4\\ranks\\r"+stats.rank+".png";
			user.twitchID = doc[0].twitchID;
			callback();
		});
	});
};

exports.logData = function(callback){
	for(i=0;i<users.length;i++){
		logStatsForUser(users[i]);
	}
	callback();
};

exports.logSingleUser = function(singleUser, callback){
	logStatsForUser(singleUser, function(){
		getStatsForUser(singleUser, function(){
			callback();
		});
	});
};



/* other links to try
/  warsawoverviewpopulate
/  warsawoverviewhistory
/  warsawdetailedstatspopulate
/  warsawWeaponsPopulateStats
/  warsawWeaponAccessoriesPopulateStats/[personaID]/1/[WEAPON ID like 3A6B6A16-E5A1-33E0-5B53-56E77833DAF4]/
/  warsawvehiclesPopulateStats
/  warsawbattlepackspopulate/[personaID]/2048/1/
/  warsawawardspopulate
*/