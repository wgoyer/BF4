var logStats = require('./routes/logData.js');

logStats.dailyStatsForAllUsers('daily', function(){
	logStats.dailyStatsForAllUsers('stats', function(){
	});
});