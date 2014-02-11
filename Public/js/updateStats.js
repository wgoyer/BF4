var updateStats = function(user){
	var userTable = '#'+user+' .playerDemo';
	var userRank = '#'+user+' .playerRank';
	$.ajax({
		type: 'POST',
		url:'/updateStats/'+user,
		beforeSend: function(){
			$(userTable).html('<img height="55px", width="45px", src = "/public/images/gifs/loading.gif" />');
		}
	}).success(function(data){
		generateTable(data, function(newHtml){
			$(userTable).html(newHtml);
			$(userRank).html('<img class = "rank" src = "/public/images/'+data.rankImage+'"/>');
		});
	});
};

var generateTable = function(data, callback){
	var timePlayed = data.timePlayed;
	var newHtml = "<table border='1'><tr><td>Kills</td><td>Deaths</td><td>K/Dr</td><td>H-Shots</td><td>Score</td><td>Skill</td><td>Hrs Played</td></tr><tr><td>"+data.kills+"</td><td style='color:red'>"+data.deaths+"</td><td style='color:green'>"+data.kdr+"</td><td>"+data.headShots+"</td><td>"+data.score+"</td><td>"+data.skill+"</td><td>"+timePlayed+"</td></tr></table>";
	callback(newHtml);
};