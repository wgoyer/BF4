var createChart = function(chartData, divId){
	AmCharts.ready(function () {
		var graph = new AmCharts.AmGraph();
		var chart = new AmCharts.AmSerialChart();
		chart.dataProvider = chartData;
		chart.categoryField = "date";
		graph.valueField = "difference";
		graph.type = "column";
		chart.angle = 30;
		chart.depth3D = 15;
		graph.fillAlphas = 0.5;
		graph.balloonText = "[[category]]: <b>[[value]]</b>";
		chart.addGraph(graph);
		chart.write(divId);
	});
};

// The only reason this is in two functions is because this can't run after the page has loaded.
// I can and should change this to a single function with an if clause and I will do it later.
var createChartAfterLoad = function(chartData, divId){
	var graph = new AmCharts.AmGraph();
	var chart = new AmCharts.AmSerialChart();
	chart.dataProvider = chartData;
	chart.categoryField = "date";
	graph.valueField = "difference";
	graph.type = "column";
	chart.angle = 30;
	chart.depth3D = 15;
	graph.fillAlphas = 0.5;
	graph.balloonText = "[[category]]: <b>[[value]]</b>";
	chart.addGraph(graph);
	chart.write(divId);
};