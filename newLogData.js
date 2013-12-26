var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var users = ['sweet-jeezus','bsidedemo','cpbronco','a_hostile_ndn'];
var userID = ['935235828','939582412','271431564','890563396']; // sweet-jeezus,bsidedemo,cpbronco,a_hostile_ndn
var logStatsForUser = function(user){
	//var userURI = "http://api.bf4stats.com/api/playerInfo?plat=ps4&name="+user+"&output=json";
	var userURI = "http://battlelog.battlefield.com/bf4/warsawdetailedstatspopulate/"+user+"/32/";
	MongoClient.connect('mongodb://localhost:27017/test', function(err, db){
		if(err) throw err;
		request(userURI, function(error, response, body){
			if(!error && response.statusCode == 200){
				var stats = JSON.parse(body);
				stats['dateUpdated'] = new Date();
				console.log(stats.dateUpdated);
				db.collection('bf4').insert(stats, function(err,data){
					if(err) throw err;
					db.close();
				});
			}
		});
	});
};

for(i=0;i<userID.length;i++){
	logStatsForUser(userID[i]);
}