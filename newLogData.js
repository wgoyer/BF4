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

var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var users = ['Sweet-Jeezus','bsidedemo','cpbronco','A_Hostile_NdN'];
var userID = ['935235828','939582412','271431564','890563396']; // sweet-jeezus,bsidedemo,cpbronco,a_hostile_ndn
var logStatsForUser = function(userID, userName){
	var userURI = "http://battlelog.battlefield.com/bf4/warsawdetailedstatspopulate/"+userID+"/32/";
	MongoClient.connect('mongodb://localhost:27017/test', function(err, db){
		if(err) throw err;
		request(userURI, function(error, response, body){
			if(!error && response.statusCode == 200){
				var stats = JSON.parse(body);
				stats['dateUpdated'] = new Date();
				stats['userName'] = userName;
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
	logStatsForUser(userID[i], users[i]);
}