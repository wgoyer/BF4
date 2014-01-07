var MongoClient = require('mongodb').MongoClient;
var request = require('request');

dbConnect = function(callback){
	MongoClient.connect('mongodb://localhost:27017/BF4', function(err, db){
		if(err) throw err;
		callback(db);
	});
};

getUsers = function(callback){
	userArray = [];
	dbConnect(function(db){
		db.collection('players').find().toArray(function(err, doc){
			for(i=0;i<doc.length;i++){
				userArray.push(doc[i]);
			}
			db.close();
			callback(userArray);
		});
	});
};

logStatsForUser = function(user, callback){
	var userURI = "http://battlelog.battlefield.com/bf4/warsawdetailedstatspopulate/"+user.ID+"/32/";
	dbConnect(function(db){
		request(userURI, function(error, response, body){
			if(!error && response.statusCode == 200){
				var stats = JSON.parse(body);
				stats['dateUpdated'] = new Date();
				stats['userName'] = user.name;
				stats['twitchID'] = user.twitchID;
				console.log(stats.dateUpdated);
				db.collection('stats').insert(stats, function(err,data){
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
	dbConnect(function(db){
		db.collection('stats').find(query).sort(sorter).limit(1).toArray(function(err, doc){
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
			db.close();
			callback();
		});
	});
};

logData = function(callback){
	for(i=0;i<users.length;i++){
		logStatsForUser(users[i]);
	}
	callback();
};

logSingleUser = function(singleUser, callback){
	logStatsForUser(singleUser, function(){
		getStatsForUser(singleUser, function(){
			callback();
		});
	});
};

module.exports.logSingleUser = logSingleUser;
module.exports.logData = logData;
module.exports.getStatsForUser = getStatsForUser;
module.exports.getUsers = getUsers;


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