var showTwitch = function(uName, tName){
	var centerDiv = '#'+uName+' .cardData';
	alert(centerDiv);
	$(centerDiv).html('<object id="live_embed_player_flash" type="application/x-shockwave-flash" height="378" width="620" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+tName+'" bgcolor="#000000"><param name="allowFullScreen" value="true"/><param name="allowScriptAccess" value="always"/><param name="allowNetworking" value="all"/><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf"/><param name="flashvars" value="hostname=www.twitch.tv&amp;channel='+tName+'&amp;auto_play=true&amp;start_volume=25"/></object>');
};

