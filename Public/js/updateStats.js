var updateStats = function(){
	$.ajax({
		type: 'POST',
		url:'/updateStats',
		success: function(){
			console.log('done');
		}
	}).done(function(){
		console.log('possibly loading the player divs?');
		$('.player').load();
	});
};