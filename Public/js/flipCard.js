var showTwitch = function(user){
	var jsonUser = JSON.parse(user);
	var uName = jsonUser.name;
	jsonUser.rankImage = "";
	var tName = jsonUser.twitchID;
	var centerDiv = '#'+uName+' .cardData';
	var buttonId = '#'+uName+' .btnToggle';
	$(centerDiv).html('<object id="live_embed_player_flash" type="application/x-shockwave-flash" height="378" width="620" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+tName+'" bgcolor="#000000"><param name="allowFullScreen" value="true"/><param name="allowScriptAccess" value="always"/><param name="allowNetworking" value="all"/><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf"/><param name="flashvars" value="hostname=www.twitch.tv&amp;channel='+tName+'&amp;auto_play=true&amp;start_volume=25"/></object>');
	$(buttonId).html('Stats');
	$(buttonId).attr('onClick', "showStats('"+JSON.stringify(jsonUser)+"')");
	$(buttonId).attr('name', 'stats');
		
};

var showStats = function(user){
	var jsonUser = JSON.parse(user);
	var uName = jsonUser.name;
	var tName = jsonUser.twitchId;
	var centerDiv = '#'+uName+' .cardData';
	var buttonId = '#'+uName+' .btnToggle';
	createChartAfterLoad(jsonUser.dailyStats, jsonUser.name+'_cardData');
	$(buttonId).html('Twitch');
	$(buttonId).attr('onClick', "showTwitch('"+user+"')");
	$(buttonId).attr('name', 'twitch');
};

