var createChart = function(chartData, divId){
	AmCharts.ready(function () {
		var graph = new AmCharts.AmGraph();
		var chart = new AmCharts.AmSerialChart();
		chart.dataProvider = chartData;
		chart.categoryField = "date";
		graph.valueField = "difference";
		graph.type = "column";
		graph.fillAlphas = 0.5;
		
		chart.addGraph(graph);
		chart.write(divId);
	});
};