var request = require('request');
var users = ['sweet-jeezus','bsidedemo','cpbronco','a_hostile_ndn'];

var updateUser = function(user){
	var updateURI = "http://bf4stats.com/ps4/"+user;
	request.post(updateURI, {form:{request:"updatePlayer"}},
	function(error, response){
			console.log(response.body);
	});
};

var updateSingleUser = function(user){
	updateUser(user);
};

var updateAllUsers = function(users){
	for(i=0;i<users.length;i++){
		updateUser(users[i]);
	}
};

//updateUser(users[1]);
updateAllUsers(users);