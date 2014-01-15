var statGrabber = require('./logData.js');

exports.index = function(req,res){
	createUsers(function(users){
		res.render('index', {playerArray: users});
	});
};

function createUsers(callback){
	statGrabber.getAllUsers(function(users){
		loadUserDataRecurse(users, 0, function(){
			callback(users);
		});
	});
}

function loadUserDataRecurse(users, count, callback){
	if(users.length === count){
		callback();
	} else {
		statGrabber.getStatsForUser(users[count], function(){
			statGrabber.getTwitchData(users[count], function(){
				return loadUserDataRecurse(users, count+1, callback);
			});
		});
	}
}