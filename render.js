document.addEventListener('readystatechange', e => {
    if(e.target.readyState === 'complete' ){
        charInit()
        mdcinit()
    }
})


function charInit(){
    var data = {
        datasets: [{
    
            data: [12, 7],
            backgroundColor: [
                "#1EB980",
                "#045d56"
            ],
            borderWidth: 0,
            cutout: "85%",
            tooltip: false
        }]
    
    }
    
    var config = {
        type: 'doughnut',
        data: data,
    
        options: {
    
    
            plugins: {
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
}



function mdcinit (){
    var MDCTextField = mdc.textField.MDCTextField;
    var MDCRipple = mdc.ripple.MDCRipple;
    var MDCTextFieldIcon = mdc.textField.MDCTextFieldIcon;

    
    var textField = new MDCTextField(document.querySelector('.mdc-text-field'));
    textField.value = "ddddddd"
    var icon = new MDCTextFieldIcon(document.querySelector('.mdc-text-field__icon'));
    var mdcbtn = [].map.call(document.querySelectorAll('.mdc-button'), function (el) {
        return new MDCRipple(el);
    });
}


