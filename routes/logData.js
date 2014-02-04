var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var request = require('request');

dbConnect = function(callback){
	MongoClient.connect('mongodb://localhost:27017/BF4', function(err, db){
		if(err) throw err;
		callback(db);
	});
};

getTwitchData = function(user, callback){
	twitchURI = 'http://api.justin.tv/api/stream/list.json?channel='+user.twitchID;
	request(twitchURI, function(error,response,body){
		var data = JSON.parse(body);
		if(data.length !== 0){
			user.twitchOnline=true;
		} else {
			user.twitchOnline=false;
		}
		if (callback) callback();
	});
};

dailyStatsForAllUsers = function(collection, callback){
	getAllUsers(function(userArray){
		for(i=0;i<userArray.length;i++){
			console.log('Collecting stats for '+userArray[i].name+'.');
			logStatsForUser(userArray[i], collection);
			if(i >= userArray.length -1) callback();
		}
	});
};

getAllUsers = function(callback){
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

getSingleUser = function(userName, callback){
	var query = {"name" : userName};
	dbConnect(function(db){
		db.collection('players').find(query).toArray(function(err, doc){
			callback(doc[0]);
		});
	});
};

getWeaponStats = function(user, callback){
	var weaponURI = "http://battlelog.battlefield.com/bf4/warsawWeaponsPopulateStats/"+user.ID+"/32";
	request(weaponURI, function(error, response, body){
		if(!error && response.statusCode === 200){
			var weaponStats = JSON.parse(body);
			user.weaponStats = weaponStats.data;
		}
		if (callback) callback();
	});
};

logStatsForUser = function(user, collection, callback){
	var userURI = "http://battlelog.battlefield.com/bf4/warsawdetailedstatspopulate/"+user.ID+"/32/";
	var weaponURI = "http://battlelog.battlefield.com/bf4/warsawWeaponsPopulateStats/"+user.ID+"/32";
	dbConnect(function(db){
		request(userURI, function(error, response, basicStats){
			if(!error && response.statusCode == 200){
				var stats = JSON.parse(basicStats);
				stats['dateUpdated'] = new Date();
				stats['userName'] = user.name;
				stats['twitchID'] = user.twitchID;
				//ToDo: Change this to the function call instead of embedded in this function.
				request(weaponURI, function(error, response, weaponBody){
					if(!error && response.statusCode === 200){
						var weaponStats = JSON.parse(weaponBody);
						stats['weaponStats'] = weaponStats.data;
						console.log(stats.dateUpdated);
						db.collection(collection).insert(stats, function(err,data){
							if(err) throw err;
							db.close();
							if (callback) callback();
						});
					}
				});
				
			}
		});
	});
};

getStatsForUser = function(user, callback){
	var query = {"userName" : user.name};
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

logSingleUser = function(singleUser, callback){
	logStatsForUser(singleUser, 'stats', function(){
		getStatsForUser(singleUser, function(){
			callback(singleUser);
		});
	});
};

getDailyStats = function(user, callback){
	var query = {"userName" : user.name};
	var projection = {"dateUpdated": 1, "data.generalStats.score":1, "_id": 0};
	var sorter = {"dateUpdated": -1};
	var userDaily = [];
	var tempObj = {};
	var difference = 0;
	dbConnect(function(db){
		db.collection('daily').find(query, projection).sort(sorter).limit(6).toArray(function(err, doc){
			for(i=doc.length-1;i>-1;i--){
				if(i<doc.length-1){
					difference = doc[i].data.generalStats.score - doc[i+1].data.generalStats.score;
				}
				tempObj = {
					"date" : moment(doc[i].dateUpdated).format("MMM Do YY"),
					"score" : Number(doc[i].data.generalStats.score),
					"difference" : Number(difference)
				};
				userDaily.push(tempObj);
			}
			userDaily.shift(0);
			user.dailyStats = userDaily;
			callback();
		});
	});
};

module.exports.logSingleUser = logSingleUser;
module.exports.getStatsForUser = getStatsForUser;
module.exports.getAllUsers = getAllUsers;
module.exports.getSingleUser = getSingleUser;
module.exports.logStatsForUser = logStatsForUser;
module.exports.dailyStatsForAllUsers = dailyStatsForAllUsers;
module.exports.getTwitchData = getTwitchData;
module.exports.getDailyStats = getDailyStats;
module.exports.getWeaponStats = getWeaponStats;

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