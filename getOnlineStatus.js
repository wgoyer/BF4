// http://battlelog.battlefield.com/bf4/warsawdetailedstatspopulate/<personaId>/32/
// 939582412 - bside
// 935235828 - sweetJesus
// 890563396 - hostileNDN
// 271431564 - cpBronco
// 945896447 - E5skiDawg

var request = require('request');
//var testURI = "http://battlelog.battlefield.com/bf4/user/therealbsidedemo/";
var options = {
	url : "http://battlelog.battlefield.com/bf4/user/therealbsidedemo/",
	headers : {
		// "Referer" : "http://battlelog.battlefield.com/bf4/user/therealbsidedemo/",
		"X-AjaxNavigation": "1"
	}
};


var getUserData = function(){
	request(options, function(error, response){
		if(error) console.log(error);
		console.log(JSON.parse(response.body));
	});
};

getUserData();