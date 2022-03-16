let settingHandler = {
    toggle : function (){
        var visibility = document.querySelector('#modal').style.visibility ? 'hidden' : 'visible'
        document.querySelector('#modal').style.visibility = visibility
    },
    close : function (ele, event){
        if(event.target.id==='modal'){
            document.querySelector('#modal').style.visibility = 'hidden'
            return
        }

    },
    on : function (event){
        
        // var userName = document.querySelector('#user-name-text-input').value
        var userName = localStorage.userName || ''


        var MDCTextField = mdc.textField.MDCTextField;
        var textField = new MDCTextField(document.querySelector('.mdc-text-field'))
        textField.value = userName
        document.querySelector('#modal').style.visibility = 'visible'
    }, 
    submit: function(){
        var userName = document.querySelector('#user-name-text-input').value || ""
        localStorage.setItem('userName', userName)


        var MDCSnackbar = mdc.snackbar.MDCSnackbar
        var sn = new MDCSnackbar(document.querySelector('.mdc-snackbar'))
        sn.labelText = userName.length>0 ? `저장완료! 우상단 아이콘을 클릭하여 '${userName}' 캐릭터만 필터 가능`
                                           : `유저 닉네임이 없습니다. 닉네임 입력 시 레이드목록에서 보유한 캐릭터 필터가 가능합니다.`
        sn.open()

        settingHandler.toggle()
    },

    filterToggle: function(){
        console.log('toggle userName Filter')
    }
}