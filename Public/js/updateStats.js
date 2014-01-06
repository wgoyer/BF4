var updateStats = function(){
	$.ajax({
		type: 'POST',
		url:'/updateStats',
	}).done(function(){
		console.log('possibly loading the player divs?');
		$('#Sweet-Jeezus .playerDemo').html('<img height="55px", width="45px", src = "/public/images/gifs/loading.gif" />');
	});
};