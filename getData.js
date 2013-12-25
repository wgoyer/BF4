var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/test', function(err, db){
	db.collection('bf4').find({"player.name" : "A_Hostile_NdN"}).sort({"player.dateUpdate": -1}).limit(1).toArray(function(err, rec){
		console.log(rec[0].player.dateUpdate + " " + rec[0].player.name + " " + rec[0].stats.rank);
	});
});