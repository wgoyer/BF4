// AmCharts.ready(function () {
// 	var graph = new AmCharts.AmGraph();
// 	var chart = new AmCharts.AmSerialChart();
// 	chart.dataProvider = chartData;
// 	chart.categoryField = "date";
// 	graph.valueField = "difference";
// 	graph.type = "column";
// 	graph.fillAlphas = 0.8;
	
// 	chart.addGraph(graph);
// 	chart.write('cardData');
// });

var createChart = function(user){
	var graph = new AmCharts.AmGraph();
	var chart = new AmCharts.AmSerialChart();
	chart.dataProvider = chartData;
	chart.categoryField = "date";
	graph.valueField = "difference";
	graph.type = "column";
	graph.fillAlphas = 0.8;
	
	chart.addGraph(graph);
	chart.write('cardData');
};