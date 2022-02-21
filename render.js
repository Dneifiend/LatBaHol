var data = {
    datasets: [{
        label: "완료율",
        data: [3, 10],
        backgroundColor: [
            "#1EB980",
            "#045d56"
        ],
        borderWidth: 0,
        cutout: "85%"
        
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