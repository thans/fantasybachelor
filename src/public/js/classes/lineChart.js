var LineChart = function() {
    this.contestantsByWeek = function(location, chartData) {

        $(location).highcharts({
            chart: {
                height: 600,
                type: 'area'
            },
            title: {
                text: 'Selected Contestants by Week'
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        return this.value;
                    }
                }
            },
            credits: {
                  enabled: false
            },
            yAxis: {
                title: {
                    text: 'Number of Selections'
                },
                labels: {
                    formatter: function() {
                        return this.value;
                    }
                }
            },
            tooltip: {
                headerFormat: '<i>Week {point.x}</i><br />',
                pointFormat: '<b>{point.y:,.0f}</b> people selected {series.name}'
            },
            plotOptions: {
                area: {
                    pointStart: 1,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: chartData
        });

    }
}