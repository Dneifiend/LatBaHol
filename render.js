var data = {
    datasets: [{
        data: [3, 10],
        backgroundColor: [
            "#045d56",
            "#535353"
        ],
        borderWidth: 0,
        cutout: "80%"
        
    }]
}

var config = {
    type: 'doughnut',
    data: data
};

var myChart = new Chart(
    document.getElementById('myChart'),
    config
);