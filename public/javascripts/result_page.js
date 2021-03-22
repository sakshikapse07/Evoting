gloData = null;

function update_winner(data) {
    let win = '';
    let vot = 0;
    let dt = JSON.parse(data);
    // console.log(dt);
    for (let i = 1; i < dt.length; i++) {
        // console.log(i, dt[i]);
        if (dt[i][1] > vot) {
            win = dt[i][0];
            vot = dt[i][1];
        }
    }
    // console.log("Winner : " + win + " with " + vot + " votes");
    let chartData = [];

    for (var i in dt)
        chartData.push(dt[i]);

    gloData = chartData;

    $('#winner_name').html("Winner is " + win);

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
    var visData = google.visualization.arrayToDataTable(gloData);

    var options = { 'title': 'Election Results', 'width': 550, 'height': 400 };

    var chart = new google.visualization.PieChart(document.getElementById('resChart'));
    chart.draw(visData, options);
}

function populate_chart() {
    fetch('/result')
        .then(response => response.text())
        .then(data => {
            console.log(data);
            update_winner(data);
        })
        .catch(error => {
            console.log(error);
        });
}

$(document).ready(function() {
    let chartDiv = $('#resChart');

    if (chartDiv != undefined) {
        populate_chart();
    }
});