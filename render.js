var data = {
    datasets: [{
        
        data: [12, 7],
        backgroundColor: [
            "#1EB980",
            "#045d56"
        ],
        borderWidth: 0,
        cutout: "85%",
        tooltip:false
    }]

}

var config = {
    type: 'doughnut',
    data: data,

    options: {
        

        plugins:{
            tooltip: {
                enabled: false
            },
            title: {
                display: false
            }
        }
    }

};

var myChart = new Chart(
    document.getElementById('myChart'),
    config
);